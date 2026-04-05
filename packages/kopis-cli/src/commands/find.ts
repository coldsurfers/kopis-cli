import type { Command } from 'commander';
import { createKopisClient } from '../kopis/client.js';
import { todayString } from '../utils/date.js';
import { resolveApiKey } from '../utils/resolve-api-key.js';

interface FindOptions {
  startDate: string;
  endDate: string;
  category?: string;
  rows: string;
  page: string;
  format?: string;
  apiKey?: string;
}

export function registerFindCommand(program: Command) {
  program
    .command('find')
    .description('공연 목록 조회')
    .requiredOption('--startDate <date>', '조회 시작일 (yyyyMMdd)')
    .option('--endDate <date>', '조회 종료일 (yyyyMMdd)', todayString())
    .option('--category <code>', '장르 필터 (CCCD, AAAA, CCCA, CCCC, GGGA, BBBC, BBBE)')
    .option('--rows <number>', '페이지당 결과 수', '50')
    .option('--page <number>', '페이지 번호', '1')
    .option('--format <type>', '출력 형식 (json)', 'json')
    .option('--apiKey <key>', 'KOPIS API Key (KOPIS_KEY env 사용 가능)')
    .action(async (opts: FindOptions) => {
      const apiKey = resolveApiKey(opts);
      const client = createKopisClient(apiKey);

      const results = await client.getPerformanceList({
        startDate: opts.startDate,
        endDate: opts.endDate,
        rows: Number(opts.rows),
        page: Number(opts.page),
        category: opts.category,
      });

      console.log(JSON.stringify(results, null, 2));
    });
}
