import { XMLParser } from 'fast-xml-parser';
import { todayString } from '../utils/date.js';
import type {
  KopisAwardPerformance,
  KopisCreatorPerformance,
  KopisFestivalPerformance,
  KopisHall,
  KopisPerformance,
  KopisPerformanceDetail,
  KopisPromoter,
  KopisTicketInfo,
  KopisVenue,
  KopisVenueDetail,
  ListParams,
  PromoterListParams,
  VenueListParams,
} from './types.js';

const KOPIS_BASE = 'http://www.kopis.or.kr/openApi/restful/pblprfr';
const KOPIS_VENUE_BASE = 'http://www.kopis.or.kr/openApi/restful/prfplc';
const KOPIS_PROMOTER_BASE = 'http://www.kopis.or.kr/openApi/restful/mnfct';
const KOPIS_AWARD_BASE = 'http://www.kopis.or.kr/openApi/restful/prfawad';
const KOPIS_FESTIVAL_BASE = 'http://www.kopis.or.kr/openApi/restful/prffest';
const KOPIS_CREATOR_BASE = 'http://www.kopis.or.kr/openApi/restful/prfper';

interface RawListItem {
  mt20id: string;
  prfnm: string;
  prfpdfrom: string;
  prfpdto: string;
  fcltynm: string;
  poster: string;
  area: string;
  genrenm: string;
  prfstate: string;
  openrun: string;
}

interface RawDetail {
  mt20id: string;
  mt10id: string;
  prfnm: string;
  prfpdfrom: string;
  prfpdto: string;
  fcltynm: string;
  poster: string;
  area: string;
  genrenm: string;
  prfstate: string;
  openrun: string;
  prfruntime: string;
  prfage: string;
  pcseguidance: string;
  sty: string;
  dtguidance: string;
  styurls?: { styurl: string | string[] };
  relates?: { relate: RawRelate | RawRelate[] };
}

interface RawRelate {
  relatenm: string;
  relateurl: string;
}

interface RawHall {
  mt13id: string;
  prfplcnm: string;
  seatscale: number;
  stageorchat: string;
}

interface RawVenueDetail {
  mt10id: string;
  fcltynm: string;
  mt13cnt: number;
  fcltychartr: string;
  opende: string;
  seatscale: number;
  telno: string;
  relateurl: string;
  adres: string;
  la: string;
  lo: string;
  mt13s?: { mt13: RawHall | RawHall[] };
}

interface RawAwardItem extends RawListItem {
  awards: string;
}

function toAwardPerformance(raw: RawAwardItem): KopisAwardPerformance {
  return {
    ...toPerformance(raw),
    awards: String(raw.awards ?? ''),
  };
}

interface RawFestivalItem extends RawListItem {
  festival: string;
}

function toFestivalPerformance(raw: RawFestivalItem): KopisFestivalPerformance {
  return {
    ...toPerformance(raw),
    festival: String(raw.festival ?? ''),
  };
}

interface RawCreatorItem extends RawListItem {
  author: string;
  creator: string;
}

function toCreatorPerformance(raw: RawCreatorItem): KopisCreatorPerformance {
  return {
    ...toPerformance(raw),
    author: String(raw.author ?? ''),
    creator: String(raw.creator ?? ''),
  };
}

interface RawPromoterItem {
  mt30id: string;
  entrpsnm: string;
  prfnm: string;
  genrenm: string;
  telno: string;
  relateurl: string;
}

function toPromoter(raw: RawPromoterItem): KopisPromoter {
  return {
    id: String(raw.mt30id),
    name: String(raw.entrpsnm),
    latestWork: String(raw.prfnm ?? ''),
    genre: String(raw.genrenm ?? ''),
    phone: String(raw.telno ?? ''),
    homepage: String(raw.relateurl ?? ''),
  };
}

interface RawVenueItem {
  mt10id: string;
  fcltynm: string;
  mt13cnt: number;
  fcltychartr: string;
  sidonm: string;
  gugunnm: string;
  opende: string;
}

function parseHalls(mt13s?: { mt13: RawHall | RawHall[] } | undefined): KopisHall[] {
  if (!mt13s?.mt13) return [];
  const list = Array.isArray(mt13s.mt13) ? mt13s.mt13 : [mt13s.mt13];
  return list.map((h) => ({
    id: String(h.mt13id),
    name: String(h.prfplcnm ?? ''),
    seatCount: Number(h.seatscale ?? 0),
    stageOrOrchestra: String(h.stageorchat ?? ''),
  }));
}

function toVenueDetail(raw: RawVenueDetail): KopisVenueDetail {
  return {
    id: String(raw.mt10id),
    name: String(raw.fcltynm),
    hallCount: Number(raw.mt13cnt ?? 0),
    type: String(raw.fcltychartr ?? ''),
    openYear: String(raw.opende ?? ''),
    seatScale: Number(raw.seatscale ?? 0),
    phone: String(raw.telno ?? ''),
    homepage: String(raw.relateurl ?? ''),
    address: String(raw.adres ?? ''),
    latitude: String(raw.la ?? ''),
    longitude: String(raw.lo ?? ''),
    halls: parseHalls(raw.mt13s),
  };
}

function toVenue(raw: RawVenueItem): KopisVenue {
  return {
    id: String(raw.mt10id),
    name: String(raw.fcltynm),
    hallCount: Number(raw.mt13cnt ?? 0),
    type: String(raw.fcltychartr ?? ''),
    sido: String(raw.sidonm ?? ''),
    gugun: String(raw.gugunnm ?? ''),
    openYear: String(raw.opende ?? ''),
  };
}

function toPerformance(raw: RawListItem): KopisPerformance {
  return {
    id: String(raw.mt20id),
    title: String(raw.prfnm),
    startDate: String(raw.prfpdfrom),
    endDate: String(raw.prfpdto),
    venue: String(raw.fcltynm),
    poster: String(raw.poster ?? ''),
    area: String(raw.area),
    genre: String(raw.genrenm),
    state: String(raw.prfstate),
    openRun: String(raw.openrun ?? ''),
  };
}

function parseDetailImages(styurls?: { styurl: string | string[] } | undefined): string[] {
  if (!styurls?.styurl) return [];
  return Array.isArray(styurls.styurl) ? styurls.styurl : [styurls.styurl];
}

function parseTickets(
  relates?: { relate: RawRelate | RawRelate[] } | undefined
): KopisTicketInfo[] {
  if (!relates?.relate) return [];
  const list = Array.isArray(relates.relate) ? relates.relate : [relates.relate];
  return list
    .filter((r) => r.relatenm && r.relateurl)
    .map((r) => ({ seller: r.relatenm, url: r.relateurl }));
}

function toPerformanceDetail(raw: RawDetail): KopisPerformanceDetail {
  return {
    id: String(raw.mt20id),
    facilityId: String(raw.mt10id ?? ''),
    title: String(raw.prfnm),
    startDate: String(raw.prfpdfrom),
    endDate: String(raw.prfpdto),
    venue: String(raw.fcltynm),
    poster: String(raw.poster ?? ''),
    area: String(raw.area),
    genre: String(raw.genrenm),
    state: String(raw.prfstate),
    openRun: String(raw.openrun ?? ''),
    runtime: String(raw.prfruntime ?? ''),
    ageLimit: String(raw.prfage ?? ''),
    price: String(raw.pcseguidance ?? ''),
    synopsis: String(raw.sty ?? ''),
    timeGuide: String(raw.dtguidance ?? ''),
    detailImages: parseDetailImages(raw.styurls),
    tickets: parseTickets(raw.relates),
  };
}

export class KopisApiError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'KopisApiError';
  }
}

function checkApiError(parsed: Record<string, unknown>): void {
  const db = (parsed as { dbs?: { db?: { returncode?: string; errmsg?: string } } })?.dbs?.db;
  if (db?.returncode && db.returncode !== '00') {
    throw new KopisApiError(String(db.returncode), db.errmsg ?? 'KOPIS API 오류');
  }
}

async function safeFetch(url: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`네트워크 오류: ${message}`);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.text();
}

function resolveRows(rows?: number): number {
  const value = rows ?? 50;
  if (value > 100) {
    throw new Error('rows는 최대 100까지만 설정할 수 있습니다.');
  }
  return value;
}

export interface KopisClient {
  getPerformanceList(params: ListParams): Promise<KopisPerformance[]>;
  getPerformanceDetail(id: string): Promise<KopisPerformanceDetail | null>;
  getVenueList(params: VenueListParams): Promise<KopisVenue[]>;
  getVenueDetail(id: string): Promise<KopisVenueDetail | null>;
  getPromoterList(params: PromoterListParams): Promise<KopisPromoter[]>;
  getAwardList(params: ListParams): Promise<KopisAwardPerformance[]>;
  getFestivalList(params: ListParams): Promise<KopisFestivalPerformance[]>;
  getCreatorList(params: ListParams): Promise<KopisCreatorPerformance[]>;
}

export function createKopisClient(apiKey: string): KopisClient {
  const parser = new XMLParser();

  async function getPerformanceList(params: ListParams): Promise<KopisPerformance[]> {
    const rows = resolveRows(params.rows);
    const url = new URL(KOPIS_BASE);
    url.searchParams.set('service', apiKey);
    url.searchParams.set('stdate', params.startDate);
    url.searchParams.set('eddate', params.endDate ?? todayString());
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('cpage', String(params.page ?? 1));
    if (params.category) url.searchParams.set('shcate', params.category);
    if (params.area) url.searchParams.set('signgucode', params.area);
    if (params.subArea) url.searchParams.set('signgucodesub', params.subArea);
    if (params.facilityCode) url.searchParams.set('prfplccd', params.facilityCode);
    if (params.performState) url.searchParams.set('prfstate', params.performState);
    if (params.kidState) url.searchParams.set('kidstate', 'Y');
    if (params.openRun) url.searchParams.set('openrun', 'Y');
    if (params.afterDate) url.searchParams.set('afterdate', params.afterDate);
    if (params.title) url.searchParams.set('shprfnm', params.title);
    if (params.venue) url.searchParams.set('shprfnmfct', params.venue);

    const xml = await safeFetch(url.toString());
    const parsed = parser.parse(xml);
    checkApiError(parsed);

    const db = parsed?.dbs?.db;
    if (!db) return [];

    const items: RawListItem[] = Array.isArray(db) ? db : [db];
    return items.map(toPerformance);
  }

  async function getPerformanceDetail(id: string): Promise<KopisPerformanceDetail | null> {
    const xml = await safeFetch(`${KOPIS_BASE}/${id}?service=${apiKey}`);
    const parsed = parser.parse(xml);
    checkApiError(parsed);

    const db = parsed?.dbs?.db;
    if (!db) return null;

    return toPerformanceDetail(db as RawDetail);
  }

  async function getVenueList(params: VenueListParams): Promise<KopisVenue[]> {
    const rows = resolveRows(params.rows);
    const url = new URL(KOPIS_VENUE_BASE);
    url.searchParams.set('service', apiKey);
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('cpage', String(params.page ?? 1));
    if (params.name) url.searchParams.set('shprfnmfct', params.name);
    if (params.venueType) url.searchParams.set('fcltychartr', params.venueType);
    if (params.area) url.searchParams.set('signgucode', params.area);
    if (params.subArea) url.searchParams.set('signgucodesub', params.subArea);
    if (params.afterDate) url.searchParams.set('afterdate', params.afterDate);

    const xml = await safeFetch(url.toString());
    const parsed = parser.parse(xml);
    checkApiError(parsed);

    const db = parsed?.dbs?.db;
    if (!db) return [];

    const items: RawVenueItem[] = Array.isArray(db) ? db : [db];
    return items.map(toVenue);
  }

  async function getVenueDetail(id: string): Promise<KopisVenueDetail | null> {
    const xml = await safeFetch(`${KOPIS_VENUE_BASE}/${id}?service=${apiKey}`);
    const parsed = parser.parse(xml);
    checkApiError(parsed);

    const db = parsed?.dbs?.db;
    if (!db) return null;

    return toVenueDetail(db as RawVenueDetail);
  }

  async function getPromoterList(params: PromoterListParams): Promise<KopisPromoter[]> {
    const rows = resolveRows(params.rows);
    const url = new URL(KOPIS_PROMOTER_BASE);
    url.searchParams.set('service', apiKey);
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('cpage', String(params.page ?? 1));
    if (params.name) url.searchParams.set('entrpsnm', params.name);
    if (params.category) url.searchParams.set('shcate', params.category);
    if (params.afterDate) url.searchParams.set('afterdate', params.afterDate);

    const xml = await safeFetch(url.toString());
    const parsed = parser.parse(xml);
    checkApiError(parsed);

    const db = parsed?.dbs?.db;
    if (!db) return [];

    const items: RawPromoterItem[] = Array.isArray(db) ? db : [db];
    return items.map(toPromoter);
  }

  async function getAwardList(params: ListParams): Promise<KopisAwardPerformance[]> {
    const rows = resolveRows(params.rows);
    const url = new URL(KOPIS_AWARD_BASE);
    url.searchParams.set('service', apiKey);
    url.searchParams.set('stdate', params.startDate);
    url.searchParams.set('eddate', params.endDate ?? todayString());
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('cpage', String(params.page ?? 1));
    if (params.category) url.searchParams.set('shcate', params.category);
    if (params.area) url.searchParams.set('signgucode', params.area);
    if (params.subArea) url.searchParams.set('signgucodesub', params.subArea);
    if (params.facilityCode) url.searchParams.set('prfplccd', params.facilityCode);
    if (params.performState) url.searchParams.set('prfstate', params.performState);
    if (params.kidState) url.searchParams.set('kidstate', 'Y');
    if (params.openRun) url.searchParams.set('openrun', 'Y');
    if (params.afterDate) url.searchParams.set('afterdate', params.afterDate);
    if (params.title) url.searchParams.set('shprfnm', params.title);
    if (params.venue) url.searchParams.set('shprfnmfct', params.venue);

    const xml = await safeFetch(url.toString());
    const parsed = parser.parse(xml);
    checkApiError(parsed);

    const db = parsed?.dbs?.db;
    if (!db) return [];

    const items: RawAwardItem[] = Array.isArray(db) ? db : [db];
    return items.map(toAwardPerformance);
  }

  async function getFestivalList(params: ListParams): Promise<KopisFestivalPerformance[]> {
    const rows = resolveRows(params.rows);
    const url = new URL(KOPIS_FESTIVAL_BASE);
    url.searchParams.set('service', apiKey);
    url.searchParams.set('stdate', params.startDate);
    url.searchParams.set('eddate', params.endDate ?? todayString());
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('cpage', String(params.page ?? 1));
    if (params.category) url.searchParams.set('shcate', params.category);
    if (params.area) url.searchParams.set('signgucode', params.area);
    if (params.subArea) url.searchParams.set('signgucodesub', params.subArea);
    if (params.facilityCode) url.searchParams.set('prfplccd', params.facilityCode);
    if (params.performState) url.searchParams.set('prfstate', params.performState);
    if (params.kidState) url.searchParams.set('kidstate', 'Y');
    if (params.afterDate) url.searchParams.set('afterdate', params.afterDate);
    if (params.title) url.searchParams.set('shprfnm', params.title);
    if (params.venue) url.searchParams.set('shprfnmfct', params.venue);

    const xml = await safeFetch(url.toString());
    const parsed = parser.parse(xml);
    checkApiError(parsed);

    const db = parsed?.dbs?.db;
    if (!db) return [];

    const items: RawFestivalItem[] = Array.isArray(db) ? db : [db];
    return items.map(toFestivalPerformance);
  }

  async function getCreatorList(params: ListParams): Promise<KopisCreatorPerformance[]> {
    const rows = resolveRows(params.rows);
    const url = new URL(KOPIS_CREATOR_BASE);
    url.searchParams.set('service', apiKey);
    url.searchParams.set('stdate', params.startDate);
    url.searchParams.set('eddate', params.endDate ?? todayString());
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('cpage', String(params.page ?? 1));
    if (params.category) url.searchParams.set('shcate', params.category);
    if (params.area) url.searchParams.set('signgucode', params.area);
    if (params.subArea) url.searchParams.set('signgucodesub', params.subArea);
    if (params.facilityCode) url.searchParams.set('prfplccd', params.facilityCode);
    if (params.performState) url.searchParams.set('prfstate', params.performState);
    if (params.kidState) url.searchParams.set('kidstate', 'Y');
    if (params.afterDate) url.searchParams.set('afterdate', params.afterDate);
    if (params.title) url.searchParams.set('shprfnm', params.title);
    if (params.venue) url.searchParams.set('shprfnmfct', params.venue);

    const xml = await safeFetch(url.toString());
    const parsed = parser.parse(xml);
    checkApiError(parsed);

    const db = parsed?.dbs?.db;
    if (!db) return [];

    const items: RawCreatorItem[] = Array.isArray(db) ? db : [db];
    return items.map(toCreatorPerformance);
  }

  return {
    getPerformanceList,
    getPerformanceDetail,
    getVenueList,
    getVenueDetail,
    getPromoterList,
    getAwardList,
    getFestivalList,
    getCreatorList,
  };
}
