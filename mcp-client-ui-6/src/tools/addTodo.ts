import { generateText, tool } from "ai";
import { z } from "zod";

export const addTodo = tool({
  description: "指定した 文字列を登録する。",
  // ツールを呼び出すパラメータ
  parameters: z.object({
    text: z.string().min(1, { message: 'タイトルは必須です' })
  }),
  execute: async ({ text }) => {
    const url = import.meta.env.VITE_API_URL;
    const item = {title: text, description:"" }
    const response = await fetch(url + "/api/todos/create" ,
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
