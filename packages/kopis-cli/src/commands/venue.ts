import type { Command } from 'commander';
import { formatJson } from '../formatters/json.js';
import { formatVenueListTable } from '../formatters/table.js';
import { createKopisClient } from '../kopis/client.js';
import { resolveApiKey } from '../utils/resolve-api-key.js';

interface VenueOptions {
  name?: string;
  venueType?: string;
  area?: string;
  subArea?: string;
  afterDate?: string;
  rows: string;
  page: string;
  format: string;
  apiKey?: string;
}

export function registerVenueCommand(program: Command) {
  program
    .command('venue')
    .description('공연시설 목록 조회')
    .option('--name <name>', '시설명 검색')
    .option(
      '--venueType <code>',
      '시설특성코드 (1:중앙정부, 2:문예회관, 3:기타(공공), 4:대학로, 5:민간(대학로 외), 6:기타(해외등), 7:기타(비공연장))'
    )
    .option(
      '--area <code>',
      '지역 필터 (서울:11, 부산:26, 대구:27, 인천:28, 광주:29, 대전:30, 울산:31, 세종:36, 경기:41, 강원:51, 충북:43, 충남:44, 전북:45, 전남:46, 경북:47, 경남:48, 제주:50)'
    )
    .option('--subArea <code>', '지역(구군) 필터 - 행정표준코드 앞 4자리 (예: 서울강남구:1168)')
    .option('--afterDate <date>', '해당 일자 이후 등록/수정 항목만 출력 (yyyyMMdd)')
    .option('--rows <number>', '페이지당 결과 수', '50')
    .option('--page <number>', '페이지 번호', '1')
    .option('--format <type>', '출력 형식 (table|json)', 'table')
    .option('--apiKey <key>', 'KOPIS API Key (KOPIS_KEY env 사용 가능)')
    .action(async (opts: VenueOptions) => {
      const apiKey = resolveApiKey(opts);
      const client = createKopisClient(apiKey);

      try {
        const results = await client.getVenueList({
          rows: Number(opts.rows),
          page: Number(opts.page),
          name: opts.name,
          venueType: opts.venueType,
          area: opts.area,
          subArea: opts.subArea,
          afterDate: opts.afterDate,
        });

        if (results.length === 0) {
          console.log('조회 결과가 없습니다.');
          return;
        }

        console.log(opts.format === 'json' ? formatJson(results) : formatVenueListTable(results));
      } catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
}
