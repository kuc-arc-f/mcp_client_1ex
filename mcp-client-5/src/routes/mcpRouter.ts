import express from 'express';
import { generateText, tool } from 'ai';
import { google }  from '@ai-sdk/google';
import { getNumber } from '../tools/getNumber';
import { getTodoList } from '../tools/getTodoList';
import { addTodo } from '../tools/addTodo';

const router = express.Router();
const MODEL_NAME = "gemini-2.0-flash";

router.post('/send_mcp', async function(req: any, res: any) {
  const retObj = {ret: 500, data: null};
  try {
    const body = req.body
    console.log(body);
    const input = body.inText;

    const result = await generateText({
      model: google(MODEL_NAME),
      tools: {
        getNumber , addTodo , getTodoList ,
      },
      maxSteps: 5,
      messages: [{ role: "user", content: input }],
    });
    console.log("artifact", result.text);
    console.log("");
    return res.json({text: result.text});
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
