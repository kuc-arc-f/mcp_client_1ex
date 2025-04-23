import React from "react";
import {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import chatUtil from './lib/chatUtil';
import LibConfig from './lib/LibConfig';

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { DirectServerTransport } from "../lib/direct-transport.js";
import ApiUtil from "../lib/ApiUtil";
import { cliGetCurrentTime } from "./home/cli-get-current-time";
import { cliMcp2ex } from "./home/cli-mcp-2ex";
import { cliMcp3ex } from "./home/cli-mcp-3add";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  ChatCompletionContentPartText,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources.mjs";
console.log("#Home.");

/**
*
* @param
*
* @return
*/
function Home() {
  const [updatetime, setUpdatetime] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [getText, setGetText] = useState<string>("");
  const [sendText, setSendText] = useState<string>("");
  const [models, setModels] = useState([{name: ""}]);
  const [isDownload, setIsDownload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReceive, setIsReceive] = useState(false);

  const chatStart = async function(){
    try{    
      setText("");
      setSendText("");
      setIsDownload(false);
      const elem = document.getElementById("input_text");
      let inText = "";
      if(elem){
        inText = elem.value;
      };
      console.log("inText=", inText);
      if(!inText){ return; }
      setSendText(inText);
      setIsLoading(true);
      setIsReceive(true);
      const result = await cliMcp2ex(inText);
      if(result.content){
        console.log(result.content[0].text);
        setIsReceive(true);
        setText(result.content[0].text);
      }

      elem.value = "";
      setIsLoading(false);
      setIsDownload(true);      
    } catch(e){
      console.error(e);
    }
  }

  const button1Start = async function(){
    try{    
      const result = await cliGetCurrentTime();
      if(result.content){
        console.log(result.content[0].text);
        setIsReceive(true);
        setText(result.content[0].text);
      }
    } catch(e){
      console.error(e);
    }
  }

  const button3Start = async function(){
    try{    
      const titleElem = document.getElementById("sv3_title");
      const priceElem = document.getElementById("sv3_price");
      const title = titleElem.value;
      const price = priceElem.value;
      console.log("title=", title, price)
      const result = await cliMcp3ex(title, Number(price));
      if(result.content){
        console.log(result.content[0].text);
        setIsReceive(true);
        setText(result.content[0].text);
      }
    } catch(e){
      console.error(e);
    }
  }

  return (
  <div className="container mx-auto my-2 px-8 bg-white">
    <div className="text-end">
    </div>
      <hr />
      <h1 className="text-3xl text-gray-700 font-bold my-2"
      >Client-UI-2</h1>
      <hr />
      <h3 className="text-2xl my-2">Server1</h3>
      <button id="button" onClick={() => button1Start()}
          className="btn-blue"
          >GO</button>

      <hr className="my-2" />
      <h3 className="text-2xl my-2">Server2</h3>
      <span>TODO:</span><br />
      <input className="input_text" id="input_text" />


      <div className="flex flex-row">
        <div className="flex-1 text-center p-1">
        {isLoading ? (
          <div 
          className="animate-spin rounded-full h-8 w-8 mx-4 border-t-4 border-b-4 border-blue-500">
          </div>
        ): null}
        </div>
        <div className="flex-1 text-end p-2">
          <button id="button" onClick={() => chatStart()}
          className="btn-blue"
          >GO</button>
        </div>
      </div>
      <hr className="my-2" />
      <h3 className="text-2xl my-2">Server3: price add </h3>
      <span>Title:</span><br />
      <input className="input_text sv3_title" id="sv3_title" />
      <span>Price:</span><br />
      <input className="input_text" id="sv3_price" />
      <button id="button" onClick={() => button3Start()}
          className="btn-blue my-2"
          >GO</button>

      <hr />
      
      {isReceive ? (
      <>
        <pre className="bg-blue-100 mt-1 p-2">{sendText}</pre>
        receive:
        <div dangerouslySetInnerHTML={{ __html: text }} id="get_text_wrap"
        className="mb-8 p-2 bg-gray-100" />
        <hr className="my-1" />
      </>
      ): null}
  </div>
  )
}
export default Home;
/*
*/