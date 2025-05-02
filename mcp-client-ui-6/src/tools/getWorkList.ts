import { generateText, tool } from "ai";
import { z } from "zod";

const outMd_2 = `下記の CSVデータを、markdown記法の表形式で表示して欲しい。
======
日付 , 開始時間 , 終了時間 ,
2025-04-22 , 9:00 , 17:00 ,
2025-04-23 , 9:00 , 18:00 ,
`;

export const getWorkList = tool({
  description: "TODO一覧を、markdown記法の表形式で表示します。",
  parameters: z.object({}),
  execute: async ({}) => {
    const url = import.meta.env.VITE_API_URL;
    const item = {}
    const response = await fetch(url + "/api/mcp_work_time/list" ,
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
      let target = "| "+ row.worrk_date + " | " + row.start_time + " | " + row.end_time + " |" + "\n";
      rowMd += target;
    });
    let text = `| 日付 | 開始時間 | 終了時間 |
    | :------: |:----:|:------:|
    ${rowMd}
    `;
    console.log(text);
    return text;
    //return outMd_2;
  },
});
