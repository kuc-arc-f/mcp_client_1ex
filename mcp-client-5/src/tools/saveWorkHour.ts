import { generateText, tool } from 'ai';
import { z } from 'zod';

//"本日の作業開始 9時 作業終了 18時 を送信して。"
export const saveWorkHour = tool({
  description: "本日の作業開始 9:00 作業終了 18:00 を送信して。",
  parameters: z.object({
    start: z.string().min(1, { message: '開始時間は必須です' }),
    end: z.string().min(1, { message: '終了時間は必須です' }),
  }),
  execute: async ({ start, end }) => {
    const url = process.env.API_URL;
    const item = {start_time: start, end_time: end }
    const response = await fetch(url + "/api/mcp_work_time/create" ,
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

    return `result: Start: ${start}, End: ${end}`;
  },
});
