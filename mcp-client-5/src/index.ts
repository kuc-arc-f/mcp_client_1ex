import express from 'express';
import basicAuth  from "express-basic-auth";
import { renderToString } from 'react-dom/server';
const app = express();
import 'dotenv/config'
import Top from './pages/App';

import mcpRouter from './routes/mcpRouter';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
console.log("API_URL=", process.env.API_URL);
//console.log("GE.API_KEY=", process.env.GOOGLE_GENERATIVE_AI_API_KEY);
app.use(basicAuth({
  users: { "a1@example.com": "1111" },
  challenge: true,
}));
const errorObj = {ret: "NG", messase: "Error"};

//API
app.use('/api/mcp', mcpRouter);

// route
app.get('/*', (req: any, res: any) => {
  try {
    res.send(renderToString(Top()));
  } catch (error) {
    res.sendStatus(500);
  }
});

//start
const PORT = 3000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
console.log('start');
