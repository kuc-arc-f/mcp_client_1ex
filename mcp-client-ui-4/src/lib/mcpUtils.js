const { DirectServerTransport } = require("./direct-transport");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");

/**
*
* @param
*
* @return
*/
const getMcpTools = async (servers) => {
  const tools = [];
  const functionMap = {};
  const clients = [];
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
      ...toolsResult.tools.map((tool) => {
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


const execQuery = async (
  openai,
  model,
  mcpTools,
  query
) => {
  console.log(`\n[question] ${query}`);
  const messages = [
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
            content: toolResult.content,
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
      let target = "";
      let htm = "";
      for await (const message of response) {
        //console.log(message.choices[0].delta.content!);
        target = target.concat(message.choices[0].delta.content);
      }
      console.log();
      console.log(target);
      return target;
    } else {
      console.log(content.message.content);
    }
  }
};

module.exports = { getMcpTools , execQuery }