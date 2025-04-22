import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Mcp2exTestServer } from "./mcp-servers/mcp-2ex-test";

describe("mcp2exTest", () => {
  it("指定した 文字列を登録する。", async () => {
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
      Mcp2exTestServer.connect(serverTransport),
    ]);
    //tool-execute
    const result = await client.callTool({
      name: "mcp-2ex-test",
      arguments: {
        text: "コーヒーを購入するして、休憩する。"
      },
    });
    if(result.content[0]){
      console.log("result=", result.content[0].text);
    }
  });
});
