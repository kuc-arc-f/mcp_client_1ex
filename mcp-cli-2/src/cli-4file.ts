import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fileWriteCsv } from "./mcp-servers/file-write-csv";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

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
    fileWriteCsv.connect(serverTransport),
  ]);

  const result = await client.callTool({
    name: "file-write-csv",
    arguments: {},
  });
  console.log(result);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

export function cli_4file_execute() {
  main(); 
};