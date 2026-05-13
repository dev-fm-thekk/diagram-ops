import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { SessionStatus, type EndSessionRequest, type EndSessionResponse, type GetSessionRequest, type GetSessionResponse, type SendMessageRequest, type SendMessageResponse } from '../../../generated/agent'
import { checkpointMessagesToHistory, getSessionIdFromRequest,  } from '../../utils/utils'
import { buildCompiledGraph } from '../../agents/agent'
import { MemorySaver } from '@langchain/langgraph'
import { BaseMessage, HumanMessage } from '@langchain/core/messages'

const memorySavor = new MemorySaver();
const graph = buildCompiledGraph(memorySavor)

const AgentServiceHandler: grpc.UntypedServiceImplementation = {
    SendMessage(call: grpc.ServerDuplexStream<SendMessageRequest, SendMessageResponse>): void {
        call.on("data", async(req: SendMessageRequest) => {
            const sessionId = getSessionIdFromRequest(req)
            const threadId = sessionId ? sessionId : crypto.randomUUID()
            const config = { configurable: { thread_id: threadId } }
            
           
            for await (const chunk of await graph.stream(
                { message: [new HumanMessage(req.message.trim())] },
                config
            )) {

                if (chunk['planning-agent']) {
                    if (chunk['planning-agent'].plan) {
                        call.write({
                            textChunk: {
                                content: `Plan:\n${chunk['planning-agent'].plan}`,
                                chunkIndex: 0
                            },
                            sessionId: threadId,
                            session_id: threadId,
                        } as any);
                    }
                    if (chunk['planning-agent'].design) {
                        call.write({
                            textChunk: {
                                content: `Designs:\n${chunk['planning-agent'].design}`,
                                chunkIndex: 0
                            },
                            sessionId: threadId,
                            session_id: threadId,
                        } as any);
                    }
                }

                if (chunk['code-generator'] && chunk['code-generator'].code) {
                    call.write({
                        textChunk: {
                            content: `Code:\n${chunk['code-generator'].code}`,
                            chunkIndex: 0
                        },
                        sessionId: threadId,
                        session_id: threadId,
                    } as any);
                }

                if (chunk['code-generator'] && chunk['code-generator'].code) {
                    call.write({
                        textChunk: {
                            content: `Code Change:\n${chunk['code-generator'].code}`,
                            chunkIndex: 0
                        },
                        sessionId: threadId,
                        session_id: threadId,
                    } as any);
                }

                if (chunk['code-reviewer'] && chunk['code-reviewer'].error) {
                    call.write({
                        error: {
                            code: 2,
                            message: `Code Review Error: ${chunk['code-reviewer'].error}`
                        },
                        sessionId: threadId,
                        session_id: threadId,
                    } as any);
                }

                if (chunk.orchestrator && chunk.orchestrator.message) {
                    call.write({
                        textChunk: {
                            content: chunk.orchestrator.message.toString().trim(),
                            chunkIndex: 0
                        },
                        sessionId: threadId,
                        session_id: threadId,
                    } as any);
                }
            }
    
        })
    },
    async GetSession(
        call: grpc.ServerUnaryCall<GetSessionRequest, GetSessionResponse>,
        callback: grpc.sendUnaryData<GetSessionResponse>
    ) {
        try {
            const sessionId = getSessionIdFromRequest(call.request)
            if (!sessionId) {
                callback(
                    {
                        code: grpc.status.INVALID_ARGUMENT,
                        message: "session_id is required",
                    } as grpc.ServiceError,
                    null
                )
                return
            }

            const snapshot = await graph.getState({
                configurable: { thread_id: sessionId },
            })

            const rawMessages = snapshot.values?.message
            const messages: BaseMessage[] = Array.isArray(rawMessages)
                ? rawMessages.filter((m): m is BaseMessage => m instanceof BaseMessage)
                : []

            const history = checkpointMessagesToHistory(sessionId, messages)
            const status =
                history.length > 0 ? SessionStatus.SESSION_ACTIVE : SessionStatus.SESSION_UNSPECIFIED

            callback(null, { sessionId, session_id: sessionId, history, status } as any)
        } catch (e: any) {
            callback({
                code: grpc.status.INTERNAL,
                message: e?.message ?? "Failed to get session"
            } as grpc.ServiceError, null);
        }
    },

    async EndSession(
        call: grpc.ServerUnaryCall<EndSessionRequest, EndSessionResponse>,
        callback: grpc.sendUnaryData<EndSessionResponse>
    ) {
        try {
            // Implement session cleanup/end logic here, example:
            const sessionId = call.request.sessionId;
            // await graph.endSession({ thread_id: sessionId });
            // This can be implemented as needed.
            callback(null, { success: true });
        } catch (e: any) {
            callback({
                code: grpc.status.INTERNAL,
                message: e?.message ?? "Failed to end session"
            } as grpc.ServiceError, null);
        }
    }
}


export default AgentServiceHandler