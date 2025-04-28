import express from 'express';
import basicAuth  from "express-basic-auth";
import { renderToString } from 'react-dom/server';
import cookieParser from 'cookie-parser';
const app = express();
import 'dotenv/config'
import config from "./config";
import Top from './pages/App';

import mcpRouter from './routes/mcpRouter';
import userRouter from './routes/user';

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
console.log("API_URL=", process.env.API_URL);
//console.log("GE.API_KEY=", process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const errorObj = {ret: "NG", messase: "Error"};

//API
app.use('/api/mcp', mcpRouter);
app.use('/api/user', userRouter);

//Middleware
app.get('/*', function(req, res, next) {
  const COOKIE_NAME = config.COOKIE_NAME;
  console.log(req.cookies[ COOKIE_NAME ]);
  if (req.path !== "/login") {
    if (!req.cookies[ COOKIE_NAME ]) {
      return res.redirect('/login');
    }
  }
  next();
});

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
