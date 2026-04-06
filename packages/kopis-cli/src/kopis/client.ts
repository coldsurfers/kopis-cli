import { XMLParser } from 'fast-xml-parser';
import { todayString } from '../utils/date.js';
import type {
  KopisPerformance,
  KopisPerformanceDetail,
  KopisTicketInfo,
  ListParams,
} from './types.js';

const KOPIS_BASE = 'http://www.kopis.or.kr/openApi/restful/pblprfr';

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

export function createKopisClient(apiKey: string) {
  const parser = new XMLParser();

  async function getPerformanceList(params: ListParams): Promise<KopisPerformance[]> {
    const url = new URL(KOPIS_BASE);
    url.searchParams.set('service', apiKey);
    url.searchParams.set('stdate', params.startDate);
    url.searchParams.set('eddate', params.endDate ?? todayString());
    url.searchParams.set('rows', String(params.rows ?? 50));
    url.searchParams.set('cpage', String(params.page ?? 1));
    if (params.category) url.searchParams.set('shcate', params.category);
    if (params.area) url.searchParams.set('signgucode', params.area);
    if (params.subArea) url.searchParams.set('signgucodesub', params.subArea);
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

  return { getPerformanceList, getPerformanceDetail };
}
