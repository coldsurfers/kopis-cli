import Table from 'cli-table3';
import type {
  KopisAwardPerformance,
  KopisCreatorPerformance,
  KopisFestivalPerformance,
  KopisPerformance,
  KopisPerformanceDetail,
  KopisPromoter,
  KopisVenue,
  KopisVenueDetail,
} from '../kopis/types.js';

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

export function formatVenueListTable(items: KopisVenue[]): string {
  const table = new Table({
    head: ['시설명', '시설특성', '시도', '구군', '공연장수', '개관연도'],
    colWidths: [28, 14, 14, 14, 10, 10],
    wordWrap: true,
  });

  for (const item of items) {
    table.push([item.name, item.type, item.sido, item.gugun, item.hallCount, item.openYear]);
  }

  return table.toString();
}

export function formatVenueDetailTable(detail: KopisVenueDetail): string {
  const table = new Table({ colWidths: [15, 60], wordWrap: true });

  table.push(
    ['시설명', detail.name],
    ['시설특성', detail.type],
    ['개관연도', detail.openYear],
    ['객석수', String(detail.seatScale)],
    ['공연장수', String(detail.hallCount)],
    ['전화번호', detail.phone],
    ['홈페이지', detail.homepage],
    ['주소', detail.address],
    ['좌표', `${detail.latitude}, ${detail.longitude}`]
  );

  if (detail.halls.length > 0) {
    const hallTable = new Table({
      head: ['공연장명', '좌석수', '무대/오케스트라'],
      colWidths: [30, 12, 18],
      wordWrap: true,
    });
    for (const hall of detail.halls) {
      hallTable.push([hall.name, hall.seatCount, hall.stageOrOrchestra]);
    }
    return `${table.toString()}\n\n공연장 목록\n${hallTable.toString()}`;
  }

  return table.toString();
}

export function formatAwardListTable(items: KopisAwardPerformance[]): string {
  const table = new Table({
    head: ['공연ID', '공연명', '장르', '공연장', '기간', '상태', '수상실적'],
    colWidths: [14, 20, 10, 16, 23, 15, 30],
    wordWrap: true,
  });

  for (const item of items) {
    table.push([
      item.id,
      item.title,
      item.genre,
      item.venue,
      `${item.startDate} ~ ${item.endDate}`,
      item.state,
      item.awards,
    ]);
  }

  return table.toString();
}

export function formatFestivalListTable(items: KopisFestivalPerformance[]): string {
  const table = new Table({
    head: ['공연ID', '공연명', '장르', '공연장', '기간', '상태', '축제여부'],
    colWidths: [14, 20, 15, 16, 23, 12, 10],
    wordWrap: true,
  });

  for (const item of items) {
    table.push([
      item.id,
      item.title,
      item.genre,
      item.venue,
      `${item.startDate} ~ ${item.endDate}`,
      item.state,
      item.festival,
    ]);
  }

  return table.toString();
}

export function formatCreatorListTable(items: KopisCreatorPerformance[]): string {
  const table = new Table({
    head: ['공연ID', '공연명', '장르', '공연장', '기간', '상태', '원작자', '창작자'],
    colWidths: [14, 18, 10, 16, 22, 12, 24, 24],
    wordWrap: true,
  });

  for (const item of items) {
    table.push([
      item.id,
      item.title,
      item.genre,
      item.venue,
      `${item.startDate} ~ ${item.endDate}`,
      item.state,
      item.author,
      item.creator,
    ]);
  }

  return table.toString();
}

export function formatPromoterListTable(items: KopisPromoter[]): string {
  const table = new Table({
    head: ['ID', '제작사명', '최신작품', '장르', '전화번호', '홈페이지'],
    colWidths: [14, 22, 24, 12, 18, 30],
    wordWrap: true,
  });

  for (const item of items) {
    table.push([item.id, item.name, item.latestWork, item.genre, item.phone, item.homepage]);
  }

  return table.toString();
}
