import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { GetRandomNumber } from "./mcp-servers/get-random-number";
import { Mcp2exTestServer } from "./mcp-servers/mcp-2ex-test.ts";


describe("getRandomNumber", () => {
  it("ランダムな数字を返す。", async () => {
    // テスト用クライアントの作成
    const client = new Client({
      name: "test client",
      version: "0.1.0",
    });

    // インメモリ通信チャネルの作成
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    // クライアントとサーバーを接続
    await Promise.all([
      client.connect(clientTransport),
      GetRandomNumber.connect(serverTransport),
    ]);
    //tool-execute
    const result = await client.callTool({
      name: "get-random-number",
      arguments: {
      },
    });
    if(result.content[0]){
      console.log("result=", result.content[0].text);
    }
  });
});
