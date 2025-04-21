import React from "react";
import {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
import ollama from 'ollama/browser'
import { marked } from 'marked';
import chatUtil from './lib/chatUtil';
import LibConfig from './lib/LibConfig';

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import OpenAI from "openai";
import { DirectServerTransport } from "../lib/direct-transport.js";
import { TimeServer } from "../mcp-servers/get-current-time";
import { TimeServer } from "../mcp-servers/get-current-time";
import { Mcp2exTestServer } from "../mcp-servers/mcp-2ex-test.js";
import { Mcp3useCreate } from "../mcp-servers/mcp-3use-create";
import ApiUtil from "../lib/ApiUtil";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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
const getMcpTools = async (servers: McpServer[]) => {
  const tools: ChatCompletionTool[] = [];
  const functionMap: Record<string, Client> = {};
  const clients: Client[] = [];
  for (const server of servers) {
    const mcpClient = new Client({
      name: "mcp-client-cli",
      version: "1.0.0",
    });
    // Connecting McpServer directly to McpClient
    const transport = new DirectServerTransport();
    server.connect(transport);
    await mcpClient.connect(transport.getClientTransport());

    clients.push(mcpClient);
    const toolsResult = await mcpClient.listTools();
    tools.push(
      ...toolsResult.tools.map((tool): ChatCompletionTool => {
        functionMap[tool.name] = mcpClient;
        return {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
          },
        };
      })
    );
  }
  const close = () => {
    return Promise.all(
      clients.map(async (v) => {
        await v.close();
      })
    );
  };
  return { tools, functionMap, close };
};

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

  const query = async (
    openai: OpenAI,
    model: string,
    mcpTools: Awaited<ReturnType<typeof getMcpTools>>,
    query: string
  ) => {
    console.log(`\n[question] ${query}`);
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "日本語を使用する,タグを出力しない,plain/textで回答する",
      },
      {
        role: "user",
        content: query,
      },
    ];
  
    const response = await openai.chat.completions.create({
      model,
      messages: messages,
      tools: mcpTools.tools,
    });
  
    for (const content of response.choices) {
      if (content.finish_reason === "tool_calls" && content.message.tool_calls) {
        await Promise.all(
          content.message.tool_calls.map(async (toolCall) => {
            const toolName = toolCall.function.name;
            const toolArgs = toolCall.function.arguments;
            const mcp = mcpTools.functionMap[toolName];
            console.info(`[tool] ${toolName} ${toolArgs}`);
            if (!mcp) {
              throw new Error(`Tool ${toolName} not found`);
            }
  
            const toolResult = await mcp.callTool({
              name: toolName,
              arguments: JSON.parse(toolArgs),
            });
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: toolResult.content as Array<ChatCompletionContentPartText>,
            });
          })
        );
  
        const response = await openai.chat.completions.create({
          model,
          messages,
          max_completion_tokens: 512,
          stream: true,
        });
        console.log("[answer]");
        let target = "";
        let htm = "";
        for await (const message of response) {
          //console.log(message.choices[0].delta.content!);
          target = target.concat(message.choices[0].delta.content!);
        }
        console.log();
        console.log(target);
        htm = marked.parse(target);
        setText(htm);
      } else {
        console.log(content.message.content);
      }
    }
  };

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
      console.log("selectModel=", selectModel);
      if(!selectModel){
        alert("Error, model set")
         return; 
      }
      if(!inText){ return; }
      setSendText(inText);
      setIsLoading(true);
      setIsReceive(true);

      const openai = new OpenAI({
        baseURL: "http://localhost:11434/v1",
        apiKey: "ollama",
        dangerouslyAllowBrowser: true,
      });
      const model = selectModel;
      const mcpTools = await getMcpTools([
        TimeServer, Mcp2exTestServer, Mcp3useCreate
      ]);
      await query(openai, model, mcpTools, inText);
      await mcpTools.close();
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
    <div className="text-end">
      <span>model: </span>
      <select value={selectModel} onChange={handleChange}>
        <option value="" disabled>-- Select Please --</option>
        {models.map((item, index) => (
            <option key={index} value={item.name}>{item.name}</option>
        ))}
      </select>
    </div>
      <hr />
      <h1 className="text-3xl text-gray-700 font-bold my-2"
      >Mcp-Client-UI</h1>
      <hr />
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
/*
*/