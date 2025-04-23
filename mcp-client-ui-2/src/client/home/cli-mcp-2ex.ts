import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Mcp2exTestServer } from "../../mcp-servers/mcp-2ex-test";

export async function cliMcp2ex(value: string) {
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

  const result = await client.callTool({
    name: "mcp-2ex-test",
    arguments: { text: value },
  });
  console.log(result);
  return result;
}

