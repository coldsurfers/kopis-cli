import type { Command } from 'commander';
import { formatJson } from '../formatters/json.js';
import { formatPerformanceDetailTable } from '../formatters/table.js';
import { createKopisClient } from '../kopis/client.js';
import { resolveApiKey } from '../utils/resolve-api-key.js';

interface DetailOptions {
  format: string;
  apiKey?: string;
}

export function registerDetailCommand(program: Command) {
  program
    .command('detail <id>')
    .description('공연 상세 조회')
    .option('--format <type>', '출력 형식 (table|json)', 'table')
    .option('--apiKey <key>', 'KOPIS API Key (KOPIS_KEY env 사용 가능)')
    .action(async (id: string, opts: DetailOptions) => {
      const apiKey = resolveApiKey(opts);
      const client = createKopisClient(apiKey);

      try {
        const result = await client.getPerformanceDetail(id);

        if (!result) {
          console.error(`공연 ID "${id}"에 해당하는 정보를 찾을 수 없습니다.`);
          process.exit(1);
        }

        console.log(
          opts.format === 'json' ? formatJson(result) : formatPerformanceDetailTable(result)
        );
      } catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
}
