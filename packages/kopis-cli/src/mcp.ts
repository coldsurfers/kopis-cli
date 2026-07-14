import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp/server.js';

// stdio transport 는 stdout 을 프로토콜 채널로 쓰므로, 진단 로그는 반드시 stderr 로만 낸다.
async function main() {
  const apiKey = process.env.KOPIS_KEY;
  if (!apiKey) {
    console.error('Error: KOPIS_KEY 환경변수가 필요합니다. MCP 서버 설정의 env 에 넣으세요.');
    process.exit(1);
  }

  const server = createMcpServer(apiKey);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('@coldsurf/tickets MCP 서버가 stdio 로 연결되었습니다.');
}

main().catch((err) => {
  console.error(`MCP 서버 기동 실패: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
