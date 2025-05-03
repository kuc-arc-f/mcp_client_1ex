import { z } from "zod";
import { createObjectCsvWriter } from 'csv-writer';
import { generateText, tool } from 'ai';

export const fileWriteCsv = tool({
  description: "指定した 文字列を出力する",
  parameters: z.object({}),
  execute: async () => {
    const url = process.env.API_URL;
    const response = await fetch(url + "/api/mcp_use_price/list" ,{
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
    //return { content: [{type: "text", text: json.data,},],};
  },
});