
import { getNumber } from "./tools/getNumber";
import { addTodo } from "./tools/addTodo";
import { getTodoList } from "./tools/getTodoList";
import { saveWorkHour } from "./tools/saveWorkHour";
import { getWorkList } from "./tools/getWorkList";
import { addTask } from "./tools/addTask";

import { generateText, tool } from "ai";
import { z } from "zod";
import { ollama } from 'ollama-ai-provider';
import 'dotenv/config';
import { createInterface } from "node:readline/promises";

const MODEL_NAME = "qwen3:8b";
//console.log("API_URL=", process.env.API_URL);

async function executeMcp(input: string) {
  let message = input + " /no_think";
  const result = await generateText({
    model: ollama(MODEL_NAME),
    tools: {
      getNumber, addTodo, saveWorkHour , getWorkList , addTask , getTodoList
    },
    maxSteps: 5,
    messages: [{ role: "user", content: message }],
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
