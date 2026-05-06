import type { GraphNode } from "@langchain/langgraph";
import type { AgentState } from "../utils/state";
import { ChatGroq } from "@langchain/groq";
import envs from "../config";
import z from "zod";
import { AIMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: envs.GROQ_API_KEY
})

const generatorOutputSchema = z.object({
    output: z.string().describe('The complete, syntactically correct Mermaid code representing the user-specified diagram, generated directly from the structured plan and design. This should be ready for use in any Mermaid renderer, with proper adherence to the selected diagramType and design constraints.')
})

const escapePromptValue = (val: string) =>
    typeof val === 'string'
        ? val.replace(/[`$]/g, '') 
        : '';

const systemPrompt = (
    plan: string,
    design: string,
    dtype: string,
    type: string,
    codeReviewError?: string
) => {
    const reviewNote = codeReviewError && codeReviewError !== "ok"
        ? `\n\nPrevious code review feedback:\n${escapePromptValue(codeReviewError)}\n\nYou must address ALL issues and concerns raised in this feedback in your new output.\n`
        : "";

    return (
        `You are the Code Generation Agent in a multi-agent Mermaid diagram workflow.

Your task:
- Generate ONLY valid Mermaid code based on the provided structured planning output (including diagramType, plan, and design/styling instructions).
- Follow all requirements, structure, grouping, and stylistic expectations described in the plan and design.
- Ensure the Mermaid syntax is correct for the given diagramType.
- Do not include any prose, explanations, comments, or Markdown—output just the Mermaid code, nothing else.
- Be precise, concise, and adapt to any edge cases or explicit user constraints present in the planning context.
${reviewNote}
Structured planning context:
plan: ${escapePromptValue(plan)}
design: ${escapePromptValue(design)}
diagramType: ${escapePromptValue(dtype)}
type: ${escapePromptValue(type)}
`
    );
}


export const CodeGenerator: GraphNode<typeof AgentState> = async (state) => {
    const codeGenModel = model.withStructuredOutput(generatorOutputSchema)
    const response = await codeGenModel.invoke([
        new SystemMessage(
            systemPrompt(state.plan!, state.design!, state.diagramType!, state.type, state.error)
                .trim()
        ),
        ...state.message
    ])

    return {
        code: response.output,
        message: [
            new AIMessage({
                name: "code-generator",
                content: response.output
            })
        ]
    }
}