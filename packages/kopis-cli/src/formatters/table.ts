import Table from 'cli-table3';
import type { KopisPerformance, KopisPerformanceDetail } from '../kopis/types.js';

export function formatPerformanceListTable(items: KopisPerformance[]): string {
  const table = new Table({
    head: ['공연명', '장르', '공연장', '지역', '기간', '상태'],
    colWidths: [28, 12, 18, 20, 25, 10],
    wordWrap: true,
  });

  for (const item of items) {
    table.push([
      item.title,
      item.genre,
      item.venue,
      item.area,
      `${item.startDate} ~ ${item.endDate}`,
      item.state,
    ]);
  }

  return table.toString();
}

export function formatPerformanceDetailTable(detail: KopisPerformanceDetail): string {
  const table = new Table({ colWidths: [15, 60], wordWrap: true });

  table.push(
    ['공연명', detail.title],
    ['장르', detail.genre],
    ['공연장', detail.venue],
    ['지역', detail.area],
    ['기간', `${detail.startDate} ~ ${detail.endDate}`],
    ['상태', detail.state],
    ['런타임', detail.runtime],
    ['관람연령', detail.ageLimit],
    ['가격', detail.price],
    ['공연시간', detail.timeGuide]
  );

  if (detail.tickets.length > 0) {
    const ticketLines = detail.tickets.map((t) => `${t.seller}: ${t.url}`).join('\n');
    table.push(['티켓', ticketLines]);
  }

  return table.toString();
}
