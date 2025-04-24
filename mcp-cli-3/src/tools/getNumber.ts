import { generateText, tool } from "ai";
import { z } from "zod";

export const getNumber = tool({
  // ツールの説明。
  description: "入力された面数のサイコロを振ります。",
  // ツールを呼び出すパラメータ
  parameters: z.object({
    dice: z.number().min(1).describe("サイコロの面数").optional().default(6),
  }),
  // LLM から実行される関数
  execute: async ({ dice }) => {
    return Math.floor(Math.random() * dice) + 1;
  },
});
