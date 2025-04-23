// Prompt:
// add_item_price を使って。 野菜ジュース 105 JPYを送信して欲しい。
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
//import ApiUtil from "../lib/ApiUtil";
import 'dotenv/config'

console.log("API_URL=", process.env.API_URL);

const server = new McpServer({
  name: "mcp-3use-create",
  version: "1.0.0",
});

server.tool(
  "add_item_price",
  "与えられた 項目名 数値 を送信して欲しい。",
  {
    text: z.string().min(1, { message: 'タイトルは必須です' }),
    num: z.number().describe("数値")
  },
  async ({text, num}) => {
    try{
      const url = process.env.API_URL;
      const item = {title: text, price: num }
      const response = await fetch(url + "/api/mcp_use_price/create" ,
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
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json),
          },
        ],
      };
    }catch(e){
      throw new Error("Error, add_item_price:" + e);
    }
    
  }
);

export const Mcp3useCreate = server;

