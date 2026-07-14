import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import pkg from '../../package.json' with { type: 'json' };
import { createKopisClient } from '../kopis/client.js';
import type { ListParams, PromoterListParams, VenueListParams } from '../kopis/types.js';
import { todayString } from '../utils/date.js';

// 공연 목록 계열(find/award/festival/creator) 공통 입력 shape — ListParams 그대로.
// startDate/endDate 는 생략 시 오늘로 채워, "오늘 공연" 같은 질의를 파라미터 없이 처리한다.
const listShape = {
  startDate: z.string().optional().describe('조회 시작일 yyyyMMdd (생략 시 오늘)'),
  endDate: z.string().optional().describe('조회 종료일 yyyyMMdd (생략 시 오늘)'),
  venue: z.string().optional().describe('공연시설명 검색어 (예: 예스24 라이브홀)'),
  title: z.string().optional().describe('공연명 검색어'),
  category: z.string().optional().describe('장르코드 (CCCD:대중음악, AAAA:연극, GGGA:뮤지컬 등)'),
  area: z.string().optional().describe('지역(시도)코드 (서울:11, 부산:26, 경기:41 등)'),
  subArea: z.string().optional().describe('지역(구군)코드 앞 4자리 (예: 서울강남구:1168)'),
  facilityCode: z.string().optional().describe('공연장코드 (예: FC000001-01)'),
  performState: z.string().optional().describe('공연상태코드 (01:예정, 02:공연중, 03:완료)'),
  kidState: z.boolean().optional().describe('아동공연만 조회'),
  openRun: z.boolean().optional().describe('오픈런만 조회'),
  afterDate: z.string().optional().describe('해당 일자 이후 등록/수정 항목만 (yyyyMMdd)'),
  rows: z.number().int().max(100).optional().describe('페이지당 결과 수 (최대 100)'),
  page: z.number().int().optional().describe('페이지 번호'),
} as const;

type ListArgs = { [K in keyof typeof listShape]?: z.infer<(typeof listShape)[K]> };

function toListParams(args: ListArgs): ListParams {
  return {
    startDate: args.startDate ?? todayString(),
    endDate: args.endDate ?? todayString(),
    venue: args.venue,
    title: args.title,
    category: args.category,
    area: args.area,
    subArea: args.subArea,
    facilityCode: args.facilityCode,
    performState: args.performState,
    kidState: args.kidState,
    openRun: args.openRun,
    afterDate: args.afterDate,
    rows: args.rows,
    page: args.page,
  };
}

// tool 결과는 구조화 JSON 을 그대로 넘겨 호스트 LLM 이 요약하게 한다.
function jsonResult(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

// SDK 가 던지는 KopisApiError·네트워크 에러를 잡아 서버를 죽이지 않고 tool 에러로 반환.
async function guard(run: () => Promise<unknown>) {
  try {
    return jsonResult(await run());
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      isError: true,
      content: [{ type: 'text' as const, text: `KOPIS 조회 실패: ${message}` }],
    };
  }
}

export function createMcpServer(apiKey: string): McpServer {
  const client = createKopisClient(apiKey);
  const server = new McpServer({ name: pkg.name, version: pkg.version });

  server.registerTool(
    'find_performances',
    {
      description:
        '공연 목록 조회. "오늘 예스24라이브홀 공연" 같은 질의는 venue 에 시설명, startDate/endDate 생략(=오늘)으로 호출한다.',
      inputSchema: listShape,
    },
    (args) => guard(() => client.getPerformanceList(toListParams(args)))
  );

  server.registerTool(
    'get_performance_detail',
    {
      description:
        '공연 상세 정보 조회 (러닝타임·가격·시놉시스·예매처 링크). id 는 공연ID(mt20id).',
      inputSchema: { id: z.string().describe('공연ID mt20id (예: PF132236)') },
    },
    ({ id }) => guard(() => client.getPerformanceDetail(id))
  );

  server.registerTool(
    'find_venues',
    {
      description: '공연시설(공연장) 목록 조회. name 으로 시설명 검색.',
      inputSchema: {
        name: z.string().optional().describe('시설명 검색어 (예: 예스24)'),
        venueType: z.string().optional().describe('시설특성코드 (2:문예회관, 4:대학로 등)'),
        area: z.string().optional().describe('지역(시도)코드 (서울:11 등)'),
        subArea: z.string().optional().describe('지역(구군)코드 앞 4자리'),
        afterDate: z.string().optional().describe('해당 일자 이후 등록/수정 항목만 (yyyyMMdd)'),
        rows: z.number().int().max(100).optional().describe('페이지당 결과 수 (최대 100)'),
        page: z.number().int().optional().describe('페이지 번호'),
      },
    },
    (args) => guard(() => client.getVenueList(args as VenueListParams))
  );

  server.registerTool(
    'get_venue_detail',
    {
      description:
        '공연시설 상세 정보 조회 (주소·좌표·수용인원·공연장 목록). id 는 시설ID(mt10id).',
      inputSchema: { id: z.string().describe('공연시설ID mt10id (예: FC000001)') },
    },
    ({ id }) => guard(() => client.getVenueDetail(id))
  );

  server.registerTool(
    'find_promoters',
    {
      description: '공연 기획·제작사 목록 조회.',
      inputSchema: {
        name: z.string().optional().describe('기획제작사명 검색어'),
        category: z.string().optional().describe('장르코드'),
        afterDate: z.string().optional().describe('해당 일자 이후 등록/수정 항목만 (yyyyMMdd)'),
        rows: z.number().int().max(100).optional().describe('페이지당 결과 수 (최대 100)'),
        page: z.number().int().optional().describe('페이지 번호'),
      },
    },
    (args) => guard(() => client.getPromoterList(args as PromoterListParams))
  );

  server.registerTool(
    'find_award_performances',
    {
      description: '수상작 공연 목록 조회 (수상내역 awards 포함).',
      inputSchema: listShape,
    },
    (args) => guard(() => client.getAwardList(toListParams(args)))
  );

  server.registerTool(
    'find_festival_performances',
    {
      description: '축제 공연 목록 조회 (축제명 festival 포함).',
      inputSchema: listShape,
    },
    (args) => guard(() => client.getFestivalList(toListParams(args)))
  );

  server.registerTool(
    'find_creator_performances',
    {
      description: '원·창작자 공연 목록 조회 (원작자 author·창작자 creator 포함).',
      inputSchema: listShape,
    },
    (args) => guard(() => client.getCreatorList(toListParams(args)))
  );

  return server;
}
