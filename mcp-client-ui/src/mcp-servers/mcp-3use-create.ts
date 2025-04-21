// Prompt:
// add_item_price を使って。 野菜ジュース 105 JPYを送信して欲しい。
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import ApiUtil from "../lib/ApiUtil";

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
      const item = {title: text, price: num }
      const res = await ApiUtil.post("/api/mcp_use_price/create", item);
      console.log(JSON.stringify(res.data))
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res.data),
          },
        ],
      };
    }catch(e){
      throw new Error("Error, add_item_price:" + e);
    }
    
  }
);

export const Mcp3useCreate = server;

