import React from "react";
import {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
import ollama from 'ollama/browser'
import { marked } from 'marked';
import chatUtil from './lib/chatUtil';
import LibConfig from './lib/LibConfig';

import { TimeServer } from "../mcp-servers/get-current-time";
import { Mcp2exTestServer } from "../mcp-servers/mcp-2ex-test.js";
import { Mcp3useCreate } from "../mcp-servers/mcp-3use-create";
import type {
  ChatCompletionContentPartText,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources.mjs";
console.log("#Home.");
let selectModel = "";

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

  const containsNewline = (str) => /\r\n|\r|\n/.test(str);

  useEffect(() => {
    (async () => {
      try{
        const model = chatUtil.getModelName(LibConfig.STORAGE_KEY_LLM_MODEL);
        console.log("model=", model);
        selectModel = model;
        const res = await ollama.list();
        //console.log(res.models);
        setModels(res.models);
      }catch(e){
        console.erros(e);
      }
    })()
  }, []);

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

      const res = await window.mySendMcp.sendMcp(inText);
      console.log(res);
      let htm = marked.parse(res);
      setText(htm);

      elem.value = "";
      setIsLoading(false);
      setIsDownload(true);      
    } catch(e){
      console.error(e);
    }
  }

  const getList = async function(){
    try{    
      const response = await ollama.list();
      console.log(response);
    } catch(e){
      console.error(e);
    }
  }

  const handleChange = (event) => {
    selectModel = event.target.value;
    setUpdatetime(String(new Date().getTime()));
    console.log("event.target.value=", event.target.value);
    localStorage.setItem(LibConfig.STORAGE_KEY_LLM_MODEL, selectModel);
  };

  return (
  <div className="container mx-auto my-2 px-8 bg-white">
    {/*
    <div className="text-end">      
      <span>model: </span>
      <select value={selectModel} onChange={handleChange}>
        <option value="" disabled>-- Select Please --</option>
        {models.map((item, index) => (
            <option key={index} value={item.name}>{item.name}</option>
        ))}
      </select>
    </div>    
    */}
      <h1 className="text-3xl text-gray-700 font-bold my-2"
      >Client-UI-4</h1>
      <hr className="my-2" />
      <textarea id="input_text" 
      className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500" 
      rows="4" 
      ></textarea>

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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          >GO</button>
        </div>
      </div>
      
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