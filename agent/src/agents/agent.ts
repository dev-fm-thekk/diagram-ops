import { BaseCheckpointSaver, END, START, StateGraph, type GraphNode } from "@langchain/langgraph";
import { AgentState } from "../utils/state";
import { PlanningNode } from "./sub-agents/planning-agent";
import { CodeGenerator } from "./sub-agents/code-generator";
import { CodeReviewAgent } from "./sub-agents/code-review";
import { ChatGroq } from "@langchain/groq";
import envs from "../config";
import { SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: envs.GROQ_API_KEY
})

const systemPrompt = `You are the orchestrator agent for a multi-step AI workflow. Engage clearly with the user, acting as an interface between them and specialized sub-agents. For each sub-agent output, provide concise summaries, explain the reasoning behind decisions, describe what is happening at each step, and clarify how tasks are accomplished. Strive to keep the user informed, answer follow-up questions, and ensure the process is fully understandable, transparent, and user-friendly.`

const orchestrator : GraphNode<typeof AgentState> = async (state) => {
  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    ...state.message
  ])

  return {
    message: [response]
  }
}

export const graph = new StateGraph(AgentState)
  .addNode("orchestrator", orchestrator)
  .addNode("planning-agent", PlanningNode)
  .addNode("code-generator", CodeGenerator)
  .addNode("code-reviewer", CodeReviewAgent)
  .addEdge(START, "orchestrator")
  .addEdge("orchestrator", "planning-agent")
  .addEdge("planning-agent", "code-generator")
  .addEdge("code-generator", "code-reviewer")
  .addConditionalEdges("code-reviewer", (state) => {
    // Quick check for error and regenerate signal to loop
    if (state.error && state.regenerate) return "code-generator";
    return END;
  })

export const buildCompiledGraph = (memory: BaseCheckpointSaver) => {
  return graph.compile({ checkpointer: memory})
}
