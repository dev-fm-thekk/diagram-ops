import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import { graph } from './src/agents/agent'
import { MemorySaver } from '@langchain/langgraph'
import { EndSessionRequest, EndSessionResponse, GetSessionRequest, GetSessionResponse, Message, Role, SendMessageRequest, SessionStatus, type SendMessageResponse } from './generated/agent'
import { AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages'
import crypto from 'crypto';

const PROTO_PATH = path.join(__dirname, "proto/agent.proto")

const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const memory = new MemorySaver();
const compiledGraph = graph.compile({ checkpointer: memory })

const proto = grpc.loadPackageDefinition(packageDef) as any

function getSessionIdFromRequest(req: unknown): string {
    const r = req as any
    const val = (typeof r?.sessionId === 'string' ? r.sessionId : undefined) ??
        (typeof r?.session_id === 'string' ? r.session_id : undefined) ??
        ''
    return val.trim()
}

function messageContentToString(content: BaseMessage['content']): string {
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === 'string') return part
                if (part && typeof part === 'object' && 'text' in part && typeof (part as { text?: unknown }).text === 'string') {
                    return (part as { text: string }).text
                }
                return JSON.stringify(part)
            })
            .join('\n')
    }
    return JSON.stringify(content)
}

function baseMessageToRole(message: BaseMessage): Role {
    if (message instanceof HumanMessage) return Role.ROLE_USER
    if (message instanceof AIMessage) return Role.ROLE_ASSISTANT
    if (message instanceof ToolMessage) return Role.ROLE_TOOL
    if (message instanceof SystemMessage) return Role.ROLE_ASSISTANT
    return Role.ROLE_UNSPECIFIED
}

function baseMessageToTimestamp(message: BaseMessage, index: number): number {
    const meta = message.response_metadata as Record<string, unknown> | undefined
    const created = meta?.created_at
    if (created != null) {
        const ms = new Date(created as string | number | Date).getTime()
        if (!Number.isNaN(ms)) return ms
    }
    return index
}

function checkpointMessagesToHistory(sessionId: string, messages: BaseMessage[]): Message[] {
    return messages.map((message, index) => ({
        sessionId,
        content: messageContentToString(message.content),
        role: baseMessageToRole(message),
        timestamp: baseMessageToTimestamp(message, index),
    }))
}

const AgentServiceHandler: grpc.UntypedServiceImplementation = {
    SendMessage(call: grpc.ServerDuplexStream<SendMessageRequest, SendMessageResponse>): void {
        call.on("data", async(req: SendMessageRequest) => {
            const sessionId = getSessionIdFromRequest(req)
            const threadId = sessionId ? sessionId : crypto.randomUUID()
            const config = { configurable: { thread_id: threadId } }

            for await (const chunk of await compiledGraph.stream(
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

            const snapshot = await compiledGraph.getState({
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
            // await compiledGraph.endSession({ thread_id: sessionId });
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


function startServer() {
    const server = new grpc.Server();
    server.addService(proto.agent.AgentService.service, AgentServiceHandler);
    const address = "0.0.0.0:3000";

    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(`Error binding gRPC server: ${err?.message || err}`);
            process.exit(1); // Ensures we don't keep running on bind error
        } else {
            // Required: Start accepting connections.
            // For gRPC testing, the connection URL is "localhost:50051".
            // You can use this with tools like grpcurl or Postman (gRPC client).
            // Example: grpcurl -plaintext localhost:50051 list
            console.log(`gRPC server running at grpc://localhost:${port}`);
            console.log(`For testing, use address: localhost:${port}`);
        }
    });
}

startServer()