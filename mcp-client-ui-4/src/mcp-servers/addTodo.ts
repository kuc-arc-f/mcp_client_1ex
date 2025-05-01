
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';

const server = new McpServer({
  name: "addTodo-example",
  version: "1.0.0",
});

server.tool(
  "addTodo", 
  "指定した 文字列を登録する。",
  {
    text: z.string().min(1, { message: 'タイトルは必須です' })
  },
  async ({ text }) => {
    try {    
      const url = import.meta.env.VITE_API_URL;
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
            text: "Response success",
          },
        ],
      };
    }catch(e){
      throw new Error("Error, addTodo:" + e);
    }
});

export const addTodo = server;
//module.exports = { addTodo };

