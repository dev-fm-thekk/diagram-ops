import { AIMessage, HumanMessage, SystemMessage, ToolMessage, type BaseMessage } from "@langchain/core/messages"
import { Message } from "../../generated/agent"
import { Role } from "../../generated/agent"

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


export {
    getSessionIdFromRequest, 
    messageContentToString,
    baseMessageToRole,
    baseMessageToTimestamp,
    checkpointMessagesToHistory
}