---
"@coldsurf/tickets": patch
---

MCP 서버 실행 커맨드 문서 수정. 멀티 bin 패키지라 `npx -y @coldsurf/tickets tickets-mcp` 는 기본 bin(CLI)이 실행되며 `tickets-mcp` 를 인자로 넘겨 실패(`unknown command`)한다. 특정 bin 을 지목하려면 `-p` 가 필요: `npx -y -p @coldsurf/tickets tickets-mcp`. README 의 `mcpServers` 설정·`claude mcp add` 예제를 바로잡음.
