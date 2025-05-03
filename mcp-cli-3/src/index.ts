
import { getNumber } from "./tools/getNumber";
import { addTodo } from "./tools/addTodo";
import { getTodoList } from "./tools/getTodoList";
import { saveWorkHour } from "./tools/saveWorkHour";
import { getWorkList } from "./tools/getWorkList";
import { addTask } from "./tools/addTask";
import { addItemPrice } from "./tools/addItemPrice";
import { sendMail } from "./tools/sendMail";
import { addItemMail } from "./tools/addItemMail";
import { fileWriteCsv } from "./tools/fileWriteCsv";
import { addItemCsv } from "./tools/addItemCsv";

import { generateText, tool } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import 'dotenv/config';
import { createInterface } from "node:readline/promises";


const MODEL_NAME = "gemini-2.0-flash";
//const GOOGLE_GENERATIVE_AI_API_KEY= process.env.GOOGLE_GENERATIVE_AI_API_KEY;
//console.log("GOOGLE_GENERATIVE_AI_API_KEY=", GOOGLE_GENERATIVE_AI_API_KEY);
//console.log("API_URL=", process.env.API_URL);

async function executeMcp(input: string) {
  const result = await generateText({
    model: google(MODEL_NAME),
    tools: {
      getNumber, addTodo, saveWorkHour , getWorkList , addTask , 
      getTodoList , addItemPrice , sendMail , addItemMail , fileWriteCsv ,
      addItemCsv , 
    },
    maxSteps: 5,
    messages: [{ role: "user", content: input }],
  });
  console.log("artifact:");
  console.log(result.text);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  while (true) {
    const input = await rl.question("input:");
    if (input === "exit") {
      break;
    }
    console.log("input=", input);
    executeMcp(input);
    break;

    rl.write("\n");
  }
}
main().catch((err) => {
    console.error("Error:", err);
})
.finally(() => {
  rl.close();
});
