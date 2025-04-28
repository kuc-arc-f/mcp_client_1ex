
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const getWorkList = tool({
  description: "作業一覧を、markdown記法の表形式で表示します。",
  parameters: z.object({}),
  execute: async ({}) => {
    const url = process.env.API_URL;
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
  },
});

