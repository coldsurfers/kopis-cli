import { XMLParser } from 'fast-xml-parser';
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

export function createKopisClient(apiKey: string) {
  const parser = new XMLParser();

  async function getPerformanceList(params: ListParams): Promise<KopisPerformance[]> {
    const url = new URL(KOPIS_BASE);
    url.searchParams.set('service', apiKey);
    url.searchParams.set('stdate', params.startDate);
    if (params.endDate) url.searchParams.set('eddate', params.endDate);
    if (params.rows) url.searchParams.set('rows', String(params.rows));
    if (params.page) url.searchParams.set('cpage', String(params.page));
    if (params.category) url.searchParams.set('shcate', params.category);

    const res = await fetch(url.toString());
    const xml = await res.text();
    const parsed = parser.parse(xml);

    const db = parsed?.dbs?.db;
    if (!db) return [];

    const items: RawListItem[] = Array.isArray(db) ? db : [db];
    return items.map(toPerformance);
  }

  async function getPerformanceDetail(id: string): Promise<KopisPerformanceDetail | null> {
    const res = await fetch(`${KOPIS_BASE}/${id}?service=${apiKey}`);
    const xml = await res.text();
    const parsed = parser.parse(xml);

    const db = parsed?.dbs?.db;
    if (!db) return null;

    return toPerformanceDetail(db as RawDetail);
  }

  return { getPerformanceList, getPerformanceDetail };
}
