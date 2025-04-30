
const { McpServer } = require ("@modelcontextprotocol/sdk/server/mcp.js");

const server = new McpServer({
  name: "get-random-example",
  version: "1.0.0",
});

server.tool(
  "get-number", 
  "ランダムな数字を返す。",
  async () => {
  const value = Math.floor(Math.random() * 9) + 1;

  return {
    content: [
      {
        type: "text",
        text: "Result : " + String(value),
      }
    ],
  };
});

const getNumber = server;
module.exports = { getNumber };
