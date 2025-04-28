import { generateText, tool } from 'ai';
import { z } from 'zod';

export const addItemPrice = tool({
  description: "与えられた 項目名 数値 を送信して欲しい。",
  parameters: z.object({
    text: z.string().min(1, { message: 'タイトルは必須です' }),
    num: z.number().describe("数値")
  }),
  execute: async ({ text, num }) => {
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
    const body = await response.text();
    return "result : " + body;
  },
});

