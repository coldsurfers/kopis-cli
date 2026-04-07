import type { Command } from 'commander';
import { formatJson } from '../formatters/json.js';
import { formatPromoterListTable } from '../formatters/table.js';
import { createKopisClient } from '../kopis/client.js';
import { resolveApiKey } from '../utils/resolve-api-key.js';

interface PromoterOptions {
  name?: string;
  category?: string;
  afterDate?: string;
  rows: string;
  page: string;
  format: string;
  apiKey?: string;
}

export function registerPromoterCommand(program: Command) {
  program
    .command('promoter')
    .description('기획/제작사 목록 조회')
    .option('--name <name>', '기획/제작사명 검색')
    .option(
      '--category <code>',
      '장르코드 필터 (대중음악:CCCD, 연극:AAAA, 클래식:CCCA, 국악:CCCC, 뮤지컬:GGGA, 무용:BBBC, 대중무용:BBBE)'
    )
    .option('--afterDate <date>', '해당 일자 이후 등록/수정 항목만 출력 (yyyyMMdd)')
    .option('--rows <number>', '페이지당 결과 수', '50')
    .option('--page <number>', '페이지 번호', '1')
    .option('--format <type>', '출력 형식 (table|json)', 'table')
    .option('--apiKey <key>', 'KOPIS API Key (KOPIS_KEY env 사용 가능)')
    .action(async (opts: PromoterOptions) => {
      const apiKey = resolveApiKey(opts);
      const client = createKopisClient(apiKey);

      try {
        const results = await client.getPromoterList({
          rows: Number(opts.rows),
          page: Number(opts.page),
          name: opts.name,
          category: opts.category,
          afterDate: opts.afterDate,
        });

        if (results.length === 0) {
          console.log('조회 결과가 없습니다.');
          return;
        }

        console.log(
          opts.format === 'json' ? formatJson(results) : formatPromoterListTable(results)
        );
      } catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
}
