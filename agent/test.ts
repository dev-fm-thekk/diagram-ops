// import { AIMessage, HumanMessage, type BaseMessage } from "@langchain/core/messages";
// import { createInterface } from "node:readline/promises";
// import { stdin as input, stdout as output } from "node:process";
// import { graph } from "./src/agent";

// const compiledGraph = graph.compile();

// const isExitCommand = (value: string): boolean => {
//   const normalized = value.trim().toLowerCase();
//   return normalized === "/exit" || normalized === "exit" || normalized === "quit";
// };

// const printHelp = () => {
//   console.log("Commands:");
//   console.log("  /exit  Exit chat");
//   console.log("  /help  Show commands");
// };

// const getAssistantMessages = (messages: BaseMessage[]): AIMessage[] => {
//   return messages.filter((message): message is AIMessage => message instanceof AIMessage);
// };

// const renderAIContent = (content: AIMessage["content"]): string => {
//   if (typeof content === "string") {
//     return content;
//   }

//   if (Array.isArray(content)) {
//     return content
//       .map((part) => {
//         if (typeof part === "string") return part;
//         if ("text" in part && typeof part.text === "string") return part.text;
//         return JSON.stringify(part);
//       })
//       .join("\n");
//   }

//   return JSON.stringify(content);
// };

// async function main() {
//   const rl = createInterface({ input, output });
//   const history: BaseMessage[] = [];

//   console.log("Diagram Ops Chat");
//   console.log("Type your prompt to generate/refine Mermaid diagrams.");
//   printHelp();

//   try {
//     while (true) {
//       const userText = await rl.question("\nYou > ");
//       if (!userText.trim()) continue;

//       if (userText.trim().toLowerCase() === "/help") {
//         printHelp();
//         continue;
//       }

//       if (isExitCommand(userText)) {
//         break;
//       }

//       const turnMessages = [...history, new HumanMessage(userText)];
//       console.log("\nAssistant is thinking...\n");

//       const result = await compiledGraph.invoke({ message: turnMessages });
//       const messages = (result.message ?? []) as BaseMessage[];
//       const aiMessages = getAssistantMessages(messages);
//       const newAiMessages = aiMessages.slice(history.filter((m) => m instanceof AIMessage).length);

//       if (newAiMessages.length === 0) {
//         console.log("Assistant > No response generated.");
//       } else {
//         for (const message of newAiMessages) {
//           const agentName =
//             typeof message.name === "string" && message.name.length > 0
//               ? message.name
//               : "assistant";
//           console.log(`[${agentName}]`);
//           console.log(renderAIContent(message.content));
//           console.log("");
//         }
//       }

//       history.splice(0, history.length, ...messages);
//     }
//   } catch (error) {
//     console.error("Chat failed:", error);
//     process.exitCode = 1;
//   } finally {
//     rl.close();
//   }
// }

// void main();
