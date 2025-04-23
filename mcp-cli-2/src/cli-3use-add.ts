import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Mcp3useCreate } from "./mcp-servers/mcp-3use-create";

async function main() {
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
    Mcp3useCreate.connect(serverTransport),
  ]);

  const result = await client.callTool({
    name: "add_item_price",
    arguments: {
      text: "コーヒー普通サイズ",
      num: 150
    },
  });
  console.log(result);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

export function cli_3use_add_execute() {
  main(); 
};