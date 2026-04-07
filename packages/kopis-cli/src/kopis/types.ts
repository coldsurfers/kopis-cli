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
  facilityCode?: string;
  performState?: string;
  kidState?: boolean;
  openRun?: boolean;
  afterDate?: string;
  title?: string;
  venue?: string;
}

export interface KopisVenue {
  id: string;
  name: string;
  hallCount: number;
  type: string;
  sido: string;
  gugun: string;
  openYear: string;
}

export interface KopisHall {
  id: string;
  name: string;
  seatCount: number;
  stageOrOrchestra: string;
}

export interface KopisVenueDetail {
  id: string;
  name: string;
  hallCount: number;
  type: string;
  openYear: string;
  seatScale: number;
  phone: string;
  homepage: string;
  address: string;
  latitude: string;
  longitude: string;
  halls: KopisHall[];
}

export interface KopisAwardPerformance extends KopisPerformance {
  awards: string;
}

export interface KopisPromoter {
  id: string;
  name: string;
  latestWork: string;
  genre: string;
  phone: string;
  homepage: string;
}

export interface PromoterListParams {
  rows?: number;
  page?: number;
  name?: string;
  category?: string;
  afterDate?: string;
}

export interface VenueListParams {
  rows?: number;
  page?: number;
  name?: string;
  venueType?: string;
  area?: string;
  subArea?: string;
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

export const KOPIS_PERFORM_STATES = {
  공연예정: '01',
  공연중: '02',
  공연완료: '03',
} as const;

export type KopisPerformStateCode =
  (typeof KOPIS_PERFORM_STATES)[keyof typeof KOPIS_PERFORM_STATES];

export const KOPIS_VENUE_TYPES = {
  중앙정부: '1',
  문예회관: '2',
  '기타(공공)': '3',
  대학로: '4',
  '민간(대학로 외)': '5',
  '기타(해외등)': '6',
  '기타(비공연장)': '7',
} as const;

export type KopisVenueTypeCode = (typeof KOPIS_VENUE_TYPES)[keyof typeof KOPIS_VENUE_TYPES];
