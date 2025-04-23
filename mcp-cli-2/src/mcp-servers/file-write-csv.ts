import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createObjectCsvWriter } from 'csv-writer';
import 'dotenv/config'

console.log("API_URL=", process.env.API_URL);

const dataItems = [
  {id: 1, title: "cofee", price: 100,},
  {id: 2, title: "orange", price: 190,},
  {id: 3, title: "green-tea", price: 120,},
];

const server = new McpServer({
  name: "file-write",
  version: "1.0.0",
});

server.tool(
  "file-write-csv",
  `指定した 文字列を登録する。`,
  {},
  async () => {
    try{
      const url = process.env.API_URL;
      const response = await fetch(url + "/api/mcp_use_price/list" ,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
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

      return {
        content: [
          {
            type: "text",
            text: json.data,
          },
        ],
      };

    }catch(e){
      throw new Error("Error, mcp-2ex-test:" + e);
    }

  }
);

export const fileWriteCsv = server;
