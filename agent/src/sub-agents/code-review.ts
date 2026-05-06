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

const reviewOutputSchema = z.object({
    error: z.string().describe(
        "Briefly note any inconsistencies, syntax errors, or mismatches between the provided Mermaid code and the plan. If the code correctly implements the plan with no issues, respond with 'ok'."
    ),
    regenerate: z.boolean().describe('Should regenerate the code?')
});

const SystemPrompt = (code: string, plan: string) => `
You are the Code Review Agent in a multi-agent Mermaid diagram workflow.

Your task:
- Quickly check for inconsistencies between the provided Mermaid code and the referenced plan.
- Identify any clear issues: syntax errors, unsupported features, obvious mismatches with the plan, or flaws that likely break rendering or comprehension.
- If problems exist, briefly summarize them and suggest a general fix (no code required).
- If the code is fine and matches the plan, reply with 'ok' as the only output.
- Be concise: state only major inconsistencies or 'ok'.

Inputs:
plan:
${plan}

code:
${code}
`;

export const CodeReviewAgent: GraphNode<typeof AgentState> = async (state) => {
    const reviewModel = model.withStructuredOutput(reviewOutputSchema);
    const response = await reviewModel.invoke([
        new SystemMessage(SystemPrompt(state.code!, state.plan!)),
        ...state.message
    ])

    const regenerate = response.error !== "ok";

    return {
        error: response.error,
        regenerate,
        message: [
            new AIMessage({
                name: "code-reviewer",
                content: regenerate
                    ? `Review failed. Regenerate required.\n${response.error}`
                    : "Review passed: ok"
            })
        ]
    };
}