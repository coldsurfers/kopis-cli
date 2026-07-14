# MCP 서버 — @coldsurf/tickets

## 목표

`@coldsurf/tickets` 패키지에 MCP(Model Context Protocol) 서버를 두 번째 bin(`tickets-mcp`)으로 추가한다.
Claude Code / Claude Desktop 같은 MCP 호스트에서 **"오늘 예스24라이브홀 공연 일정"** 같은 자연어로 KOPIS 공연 정보를 조회할 수 있게 한다.

새 API 로직은 작성하지 않는다 — 기존 `createKopisClient` SDK(8개 메서드)를 tool로 1:1 래핑만 한다.

## 핵심 흐름

```
사용자: "오늘 예스24라이브홀 공연 일정"
  → 호스트 LLM 이 find_performances({ startDate, endDate, venue }) tool 호출
  → SDK(getPerformanceList)가 KOPIS 조회 → 구조화 JSON 반환
```

자연어 → 파라미터 번역은 호스트 LLM 이 담당. 우리는 zod tool 스키마만 정확히 그린다.

## 목표 구조

```
packages/kopis-cli/
  src/
    cli.ts               (기존 — 변경 없음)
    mcp.ts               (신규 — MCP 서버 엔트리)
    mcp/
      server.ts          (신규 — McpServer 조립 + tool 등록)
    kopis/client.ts      (그대로 재사용)
    utils/
      resolve-api-key.ts (재사용, 단 MCP 는 process.exit 대신 throw 필요 — 아래 참고)
      date.ts            (재사용 — todayString)
  package.json
    bin:
      tickets     → dist/cli.js
      tickets-mcp → dist/mcp.js
  tsup.config.ts         (mcp.ts 엔트리 추가)
```

## 노출 tool (SDK 8개 메서드 1:1)

| tool 이름 | SDK 메서드 | 비고 |
| --- | --- | --- |
| `find_performances` | `getPerformanceList` | `startDate` 생략 시 오늘. `venue`=공연시설명 검색 |
| `get_performance_detail` | `getPerformanceDetail` | `id`(mt20id) |
| `find_venues` | `getVenueList` | `name`=시설명 검색 |
| `get_venue_detail` | `getVenueDetail` | `id`(mt10id) |
| `find_promoters` | `getPromoterList` | |
| `find_award_performances` | `getAwardList` | |
| `find_festival_performances` | `getFestivalList` | |
| `find_creator_performances` | `getCreatorList` | |

- transport: **stdio** 고정 (`StdioServerTransport`).
- 날짜: `find_*` tool 의 `startDate`/`endDate` 는 zod optional, 생략 시 `todayString()` 로 채운다. description 에 "yyyyMMdd, 생략 시 오늘" 명시.
- 반환: tool 결과는 `content: [{ type: 'text', text: JSON.stringify(results) }]`. 구조화 데이터를 그대로 넘겨 호스트가 요약하게 한다.
- API key: `KOPIS_KEY` 환경변수에서 읽는다. 없으면 서버 기동 시 에러. (MCP 는 `--apiKey` 플래그가 없으므로 env 만.)

## 설계 노트

- `resolve-api-key.ts` 의 `resolveApiKey` 는 실패 시 `console.error + process.exit(1)` — CLI 전용 UX. MCP 서버는 이걸 쓰지 않고, 서버 부팅부에서 `process.env.KOPIS_KEY` 를 직접 검사해 없으면 `throw` 한다(stdio 프로토콜 오염 방지 위해 로그는 stderr 로).
- tool 핸들러 공통: `createKopisClient(apiKey)` 한 번 만들어 클로저로 공유.
- 에러: SDK 가 던지는 `KopisApiError`/네트워크 에러는 tool 핸들러에서 잡아 `{ isError: true, content: [...] }` 로 반환(서버는 죽지 않음).

## 의존성 추가

- `@modelcontextprotocol/sdk` (^1.29.0)
- `zod` (^3) — MCP SDK tool 스키마용

## 체크리스트

- [x] `@modelcontextprotocol/sdk`(1.29), `zod`(4.4) 의존성 추가
- [x] `src/mcp/server.ts` — `createMcpServer(apiKey)` 로 8개 tool 등록 (listShape 공유)
- [x] `src/mcp.ts` — env 검사 → 서버 생성 → stdio 연결
- [x] `package.json` bin 에 `tickets-mcp` 추가
- [x] `tsup.config.ts` 에 `src/mcp.ts` 엔트리 추가 (banner shebang)
- [x] `pnpm build` 통과 (`dist/mcp.js` 생성 확인)
- [x] biome check --write + tsc 통과
- [x] 로컬 검증: stdio 스모크 테스트 — initialize·tools/list(8개)·find_performances 라우팅·guard 에러처리 확인 (실키만 넣으면 실조회)
- [x] README 에 MCP 사용법(mcpServers 설정) 절 추가
- [x] changeset (minor)

## 변경 범위

| 파일 | 변경 |
| --- | --- |
| `src/mcp.ts` | 신규 — 엔트리 |
| `src/mcp/server.ts` | 신규 — tool 등록 |
| `package.json` | bin + deps 추가 |
| `tsup.config.ts` | 엔트리 추가 |
| `README.md` | MCP 절 추가 |
| `.changeset/*.md` | minor |
