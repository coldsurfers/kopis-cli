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
  area?: string;
  subArea?: string;
  kidState?: boolean;
  openRun?: boolean;
  afterDate?: string;
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

export const KOPIS_AREAS = {
  서울: '11',
  부산: '26',
  대구: '27',
  인천: '28',
  광주: '29',
  대전: '30',
  울산: '31',
  세종: '36',
  경기: '41',
  강원: '51',
  충북: '43',
  충남: '44',
  전북: '45',
  전남: '46',
  경북: '47',
  경남: '48',
  제주: '50',
} as const;

export type KopisAreaCode = (typeof KOPIS_AREAS)[keyof typeof KOPIS_AREAS];
