export interface KopisPerformance {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  poster: string;
  area: string;
  genre: string;
  state: string;
  openRun: string;
}

export interface KopisTicketInfo {
  seller: string;
  url: string;
}

export interface KopisPerformanceDetail {
  id: string;
  facilityId: string;
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  poster: string;
  area: string;
  genre: string;
  state: string;
  openRun: string;
  runtime: string;
  ageLimit: string;
  price: string;
  synopsis: string;
  timeGuide: string;
  detailImages: string[];
  tickets: KopisTicketInfo[];
}

export interface ListParams {
  startDate: string;
  endDate?: string;
  rows?: number;
  page?: number;
  category?: string;
}

export const KOPIS_CATEGORIES = {
  대중음악: 'CCCD',
  연극: 'AAAA',
  '서양음악(클래식)': 'CCCA',
  '한국음악(국악)': 'CCCC',
  뮤지컬: 'GGGA',
  '무용(서양/한국무용)': 'BBBC',
  대중무용: 'BBBE',
} as const;

export type KopisCategoryCode = (typeof KOPIS_CATEGORIES)[keyof typeof KOPIS_CATEGORIES];
