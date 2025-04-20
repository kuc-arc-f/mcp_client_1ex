import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import ApiUtil from "../lib/ApiUtil";

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
      const item = {title: text, description:"" }
      const res = await ApiUtil.post(`/api/todos/create`, item);
      console.log(JSON.stringify(res.data))
      return {
        content: [
          {
            type: "text",
            text: "Response success",
          },
        ],
      };
    }catch(e){
      throw new Error("Error, mcp-2ex-test:" + e);
    }
    
  }
);

export const Mcp2exTestServer = server;
