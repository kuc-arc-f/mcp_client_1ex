import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import 'dotenv/config'
console.log("API_URL=", process.env.API_URL);

const server = new McpServer({
  name: "mcp-2ex",
  version: "1.0.0",
});

server.tool(
  "mcp-2ex-test",
  `指定した 文字列を登録する。`,
  {
    text: z.string().min(1, { message: 'タイトルは必須です' })
  },
  async ({text}) => {
    try{
      const url = process.env.API_URL;
      const item = {title: text, description:"" }
      const response = await fetch(url + "/api/todos/create" ,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }
      );
      if(response.ok === false){
        throw new Error("Error, response <> OK:");
      }
      const body = await response.text();
      return {
        content: [
          {
            type: "text",
            text: body,
          },
        ],
      };
    }catch(e){
      throw new Error("Error, mcp-2ex-test:" + e);
    }

  }
);

export const Mcp2exTestServer = server;
