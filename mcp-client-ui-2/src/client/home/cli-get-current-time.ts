import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
//import { GetRandomNumber } from "../../mcp-servers/get-random-number";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { TimeServer } from "../../mcp-servers/get-current-time";

export async function cliGetCurrentTime() {
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
    TimeServer.connect(serverTransport),
  ]);

  const result = await client.callTool({
    name: "get-current-time",
    arguments: {},
  });
  console.log(result);
  return result;
}
/*
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
*/

