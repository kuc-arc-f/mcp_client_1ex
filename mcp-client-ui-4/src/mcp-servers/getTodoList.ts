
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
//const { z } = require('zod');
import { z } from 'zod';

const server = new McpServer({
  name: "getTodoList-example",
  version: "1.0.0",
});

server.tool(
  "getTodoList", 
  "TODO一覧を、markdown記法の表形式で表示します。",
  {},
  async () => {
    try { 
      const url = import.meta.env.VITE_API_URL;
      const item = {}
      const response = await fetch(url + "/api/todos/list" ,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }
      );
      if(response.ok === false){
        throw new Error("Error, response <> OK:");
      }
      const json = await response.json();
      const out = JSON.parse(json.data) 
      const wkItems = [];
      let rowMd = "";
      out.forEach((row) => {
        let target = "| "+ row.title +  "| "+ row.created_at + " | "+ "\n";
        rowMd += target;
      });
      let text = `| TODO | 作成日時 |
      |---------|:----:|
      ${rowMd}
      `;
      //console.log(text);
      return {
        content: [
          {
            type: "text",
            text: text,
          },
        ],
      };
    }catch(e){
      throw new Error("Error, getTodoList:" + e);
    }
});

export const getTodoList = server;
//module.exports = { getTodoList };
