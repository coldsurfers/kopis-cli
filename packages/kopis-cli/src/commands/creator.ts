import type { Command } from 'commander';
import { formatJson } from '../formatters/json.js';
import { formatCreatorListTable } from '../formatters/table.js';
import { createKopisClient } from '../kopis/client.js';
import { todayString } from '../utils/date.js';
import { resolveApiKey } from '../utils/resolve-api-key.js';

interface CreatorOptions {
  startDate: string;
  endDate: string;
  category?: string;
  area?: string;
  subArea?: string;
  facilityCode?: string;
  performState?: string;
  kidState?: boolean;
  afterDate?: string;
  title?: string;
  venue?: string;
  rows: string;
  page: string;
  format: string;
  apiKey?: string;
}

export function registerCreatorCommand(program: Command) {
  program
    .command('creator')
    .description('원·창작자 목록 조회')
    .requiredOption('--startDate <date>', '공연시작일자 (yyyyMMdd)')
    .option('--endDate <date>', '공연종료일자 (yyyyMMdd)', todayString())
    .option('--category <code>', '장르 필터 (CCCD, AAAA, CCCA, CCCC, GGGA, BBBC, BBBE)')
    .option(
      '--area <code>',
      '지역 필터 (서울:11, 부산:26, 대구:27, 인천:28, 광주:29, 대전:30, 울산:31, 세종:36, 경기:41, 강원:51, 충북:43, 충남:44, 전북:45, 전남:46, 경북:47, 경남:48, 제주:50)'
    )
    .option('--subArea <code>', '지역(구군) 필터 - 행정표준코드 앞 4자리 (예: 서울강남구:1168)')
    .option('--facilityCode <code>', '공연장코드 (예: FC000001-01)')
    .option('--performState <code>', '공연상태 필터 (01:공연예정, 02:공연중, 03:공연완료)')
    .option('--kidState', '아동공연만 조회')
    .option('--afterDate <date>', '해당 일자 이후 등록/수정 항목만 출력 (yyyyMMdd)')
    .option('--title <name>', '공연명 검색')
    .option('--venue <name>', '공연시설명 검색')
    .option('--rows <number>', '페이지당 결과 수', '50')
    .option('--page <number>', '페이지 번호', '1')
    .option('--format <type>', '출력 형식 (table|json)', 'table')
    .option('--apiKey <key>', 'KOPIS API Key (KOPIS_KEY env 사용 가능)')
    .action(async (opts: CreatorOptions) => {
      const apiKey = resolveApiKey(opts);
      const client = createKopisClient(apiKey);

      try {
        const results = await client.getCreatorList({
          startDate: opts.startDate,
          endDate: opts.endDate,
          rows: Number(opts.rows),
          page: Number(opts.page),
          category: opts.category,
          area: opts.area,
          subArea: opts.subArea,
          facilityCode: opts.facilityCode,
          performState: opts.performState,
          kidState: opts.kidState,
          afterDate: opts.afterDate,
          title: opts.title,
          venue: opts.venue,
        });

        if (results.length === 0) {
          console.log('조회 결과가 없습니다.');
          return;
        }

        console.log(opts.format === 'json' ? formatJson(results) : formatCreatorListTable(results));
      } catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
}
