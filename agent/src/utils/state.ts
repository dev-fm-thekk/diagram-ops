import { MessagesValue, StateSchema } from "@langchain/langgraph";
import z from "zod";

export const diagramType = z.enum([
    'class', 
    'state', 
    'sequence', 
    'entityRelationship', 
    'flowchart', 
    'gantt', 
    'pie', 
    'requirement',
    'journey',
    'userJourney',
    'gitGraph',
    'mindmap',
    'timeline',
    'quadrantChart'
])

export const legacyType = z.enum(['uml', 'state'])

export const AgentState = new StateSchema({
    message: MessagesValue,
    plan: z.string().optional(),
    diagramType: diagramType.describe('The type of mermaid diagram to generate').optional(),
    type: legacyType, // legacy or workflow type field
    design: z.string().describe('The color pallete for generating mermaid code').optional(),
    code: z.string().describe("Mermaid code").optional(),
    error: z.string().describe('The error report from code review agent').optional(),
    regenerate: z.boolean().default(false)
})