import type { GraphNode } from "@langchain/langgraph";
import { AgentState, diagramType, legacyType } from "../../utils/state";
import { ChatGroq } from "@langchain/groq";
import envs from "../../config";
import z from "zod";
import { AIMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: envs.GROQ_API_KEY,
})

const planningOutput = z.object({
    plan: z.string().describe("A concise implementation plan for the diagram: enumerate key entities/nodes, relationships/flows, grouping, required labels or annotations, explicitly referencing any relevant details from the current state."),
    design: z.string().describe("A practical Mermaid styling direction: color palette, contrast guidance, and theme choices that keep text and connectors clearly readable, taking into account current state design preferences if present."),
    diagramType: diagramType.describe("The type of mermaid diagram to generate (e.g., class, state, sequence, etc.), as determined from the current state or user request."),
    type: legacyType.describe("The high-level diagram classification or workflow type, as determined from the current state (e.g., 'uml', 'state', etc.)."),
})

const systemPrompt = `You are the Planning Agent in a multi-agent Mermaid diagram workflow.
Produce structured planning output that downstream code-generation and review agents can execute directly.

Requirements:
- Review the current state (messages, selected diagramType, previous plan/design, user input) and update your output accordingly.
- Align closely with the user's latest intent and constraints, incorporating any recent state changes.
- If user details are missing, make sensible assumptions and keep them explicit.
- Define the diagram content clearly: entities, relationships, direction/flow, and grouping, referencing elements or instructions in the state.
- Provide a design direction with accessible, high-contrast colors and readable styling, adapting to any state-provided preferences.
- Ensure both "diagramType" (mermaid diagram type, e.g. class/state/sequence) and "type" (legacy or workflow classifier, e.g. 'uml'/'state') are included and up-to-date with current state.
- Prefer clarity and correctness over visual complexity.`

export const PlanningNode: GraphNode<typeof AgentState> = async (state) => {
    const planningModel = model.withStructuredOutput(planningOutput)
    const response = await planningModel.invoke(
        [   
            new SystemMessage(systemPrompt.trim()),
            ...state.message
        ]
    )
    return {
        plan: response.plan,
        design: response.design,
        diagramType: response.diagramType,
        type: response.type,
        message: [
            new AIMessage({
                name: "planning-agent",
                content: `Planning complete.
diagramType: ${response.diagramType}
type: ${response.type}
plan: ${response.plan}
design: ${response.design}`
            })
        ]
    }
}