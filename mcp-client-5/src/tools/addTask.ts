import { generateText, tool } from 'ai';
import { z } from 'zod';

//addTaskを使って、プロジェクトID 15 , タイトル テスト工程ー６ , 開始日 2025-04-01 , 終了日 2025-04-10 を送信して。
export const addTask = tool({
  description: `addTaskを使って、 プロジェクトID 15 , タイトル テスト工程ー６ , 開始日 2025-04-01 , 終了日 2025-04-10 
 を送信して。`, 
  parameters: z.object({
    project_id: z.number().min(1, { message: 'プロジェクトIDは必須です。' }),
    title: z.string().min(1, { message: 'タイトルは必須です' }),
    start: z.string().min(1, { message: '開始日は必須です' }),
    end: z.string().min(1, { message: '終了日は必須です' }),
  }),
  execute: async ({ project_id , title , start, end }) => {
    const url = process.env.TASK_API_URL;
    const apiKey = process.env.TASK_API_KEY;
    console.log("url=", url);
    const item = {
      api_key: apiKey,
      project_id: project_id,
      title: title,
      start: start,
      end: end,
    }
    const response = await fetch(url + "/tasks/mcp_create" ,
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
    return `result: project_id: ${project_id}, title: ${title} , Start: ${start}, End: ${end}`;
  },
});
