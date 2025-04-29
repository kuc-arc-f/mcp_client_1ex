import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import OpenAI from "openai";
import { DirectServerTransport } from "./libs/direct-transport.js";
import { Mcp2exTestServer } from "./mcp-servers/mcp-2ex-test.js";
import { GetRandomNumber } from "./mcp-servers/get-random-number";
import 'dotenv/config'
import { createInterface } from "node:readline/promises";
import { z } from "zod";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  ChatCompletionContentPartText,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources.mjs";

//const MODEL_NAME = "qwen3:14b";
const MODEL_NAME = "qwen3:8b";

const getMcpTools = async (servers: McpServer[]) => {
  const tools: ChatCompletionTool[] = [];
  const functionMap: Record<string, Client> = {};
  const clients: Client[] = [];
  for (const server of servers) {
    const mcpClient = new Client({
      name: "mcp-client-cli",
      version: "1.0.0",
    });
    // Connecting McpServer directly to McpClient
    const transport = new DirectServerTransport();
    server.connect(transport);
    await mcpClient.connect(transport.getClientTransport());

    clients.push(mcpClient);
    const toolsResult = await mcpClient.listTools();
    tools.push(
      ...toolsResult.tools.map((tool): ChatCompletionTool => {
        functionMap[tool.name] = mcpClient;
        return {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
          },
        };
      })
    );
  }
  const close = () => {
    return Promise.all(
      clients.map(async (v) => {
        await v.close();
      })
    );
  };
  return { tools, functionMap, close };
};

const query = async (
  openai: OpenAI,
  model: string,
  mcpTools: Awaited<ReturnType<typeof getMcpTools>>,
  query: string
) => {
  console.log(`\n[question] ${query}`);
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "日本語を使用する,タグを出力しない,plain/textで回答する",
    },
    {
      role: "user",
      content: query,
    },
  ];

  const response = await openai.chat.completions.create({
    model,
    messages: messages,
    tools: mcpTools.tools,
  });

  for (const content of response.choices) {
    if (content.finish_reason === "tool_calls" && content.message.tool_calls) {
      await Promise.all(
        content.message.tool_calls.map(async (toolCall) => {
          const toolName = toolCall.function.name;
          const toolArgs = toolCall.function.arguments;
          const mcp = mcpTools.functionMap[toolName];
          console.info(`[tool] ${toolName} ${toolArgs}`);
          if (!mcp) {
            throw new Error(`Tool ${toolName} not found`);
          }

          const toolResult = await mcp.callTool({
            name: toolName,
            arguments: JSON.parse(toolArgs),
          });
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: toolResult.content as Array<ChatCompletionContentPartText>,
          });
        })
      );

      const response = await openai.chat.completions.create({
        model,
        messages,
        max_completion_tokens: 512,
        stream: true,
      });
      console.log("[answer]");
      for await (const message of response) {
        process.stdout.write(message.choices[0].delta.content!);
      }
      console.log();
    } else {
      console.log(content.message.content);
    }
  }
};

async function executeMcp(inText) {
  let message = inText;
  if(MODEL_NAME === "qwen3:8b") {
    message = inText + " /no_think";
  }
  const openai = new OpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "ollama",
  });
  const mcpTools = await getMcpTools([
     Mcp2exTestServer, GetRandomNumber
  ]);
  await query(openai, MODEL_NAME, mcpTools, message);
  await mcpTools.close();
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  while (true) {
    const input = await rl.question("input:");
    if (input === "exit") {
      break;
    }
    console.log("input=", input);
    executeMcp(input);
    break;

    rl.write("\n");
  }
}
main().catch((err) => {
  console.error("Error:", err);
})
.finally(() => {
  rl.close();
});