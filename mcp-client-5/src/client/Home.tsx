import React from "react";
import {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { generateText, tool } from "ai";
import chatUtil from './lib/chatUtil';
import LibConfig from './lib/LibConfig';
import HttpCommon from './lib/HttpCommon';

console.log("#Home.");
let selectModel = "";
const MODEL_NAME = "gemini-2.0-flash";

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
      let htm = "";
      if(elem){
        inText = elem.value;
      };
      console.log("inText=", inText);
      if(!inText){ return; }
      setSendText(inText);
      setIsLoading(true);
      setIsReceive(true);
      const item  = {
        inText: inText,
      }      
      const json = await HttpCommon.post(item, "/api/mcp/send_mcp");
      console.log(json);

      elem.value = "";
      htm = marked.parse(json.text);
      setText(htm);
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
    <div className="text-end">
    </div>
      <h1 className="text-3xl text-gray-700 font-bold my-2"
      >Client-UI-5</h1>
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
          className="btn-blue"
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
