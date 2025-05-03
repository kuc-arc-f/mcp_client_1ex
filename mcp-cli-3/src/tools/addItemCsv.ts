import { generateText, tool } from 'ai';
import { createObjectCsvWriter } from 'csv-writer';
import { z } from 'zod';

export const addItemCsv = tool({
  description: "与えられた 項目名 数値 を送信して欲しい。",
  parameters: z.object({
    text: z.string().min(1, { message: 'タイトルは必須です' }),
    num: z.number().describe("数値")
  }),
  execute: async ({ text, num }) => {
    const url = process.env.API_URL;
    const item = {title: text, price: num }
    let response = await fetch(url + "/api/mcp_use_price/create" ,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }
    );
    if(response.ok === false){
      throw new Error("Error, response <> OK:");
    }
    
    // CSV
    response = await fetch(url + "/api/mcp_use_price/list" ,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if(response.ok === false){
      throw new Error("Error, response <> OK:");
    }
    const json = await response.json();
    const csvWriter = createObjectCsvWriter({
      path: './output.csv',
      header: [
        { id: 'title', title: 'title' },
        { id: 'price', title: 'price' }
      ]
    });
    const out = JSON.parse(json.data);

    await csvWriter.writeRecords(out)
    return JSON.stringify(json.data);
  },
});


