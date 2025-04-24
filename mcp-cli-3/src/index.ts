
import { getNumber } from "./tools/getNumber";
import { addTodo } from "./tools/addTodo";

import { generateText, tool } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import 'dotenv/config';
import { createInterface } from "node:readline/promises";


const MODEL_NAME = "gemini-2.0-flash";
//const API_KEY= process.env.GOOGLE_GENERATIVE_AI_API_KEY;
//console.log("API_KEY=", API_KEY);
//console.log("API_URL=", process.env.API_URL);

async function executeMcp(input: string) {
  const result = await generateText({
    model: google(MODEL_NAME),
    tools: {
      getNumber, addTodo,
    },
    maxSteps: 5,
    messages: [{ role: "user", content: input }],
  });
  console.log("artifact", result.text);
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
