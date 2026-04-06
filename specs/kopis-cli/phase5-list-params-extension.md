# Phase 5: ListParams 확장 — 공연장/아동공연/공연상태/오픈런/등록일 필터

> GitHub Issue: [#3](https://github.com/coldsurfers/kopis-cli/issues/3)

## 목표

`find` 커맨드의 `ListParams`에 KOPIS API가 지원하는 추가 필터 5종을 반영한다.

## 추가 파라미터

| CLI 옵션 | KOPIS 쿼리 키 | 설명 | 값 예시 |
|----------|---------------|------|---------|
| `--facilityCode` | `prfplccd` | 공연장코드 | `FC001247` |
| `--kidState` | `kidstate` | 아동공연만 조회 (플래그) | 설정 시 `Y` / 미설정 시 unset |
| `--performState` | `prfstate` | 공연상태코드 | `01` (예정), `02` (공연중), `03` (완료) |
| `--openRun` | `openrun` | 오픈런만 조회 (플래그) | 설정 시 `Y` / 미설정 시 unset |
| `--afterDate` | `afterdate` | 해당 일자 이후 등록/수정된 항목만 출력 | `20260101` |

## 공통 변경 패턴

파라미터당 동일한 3곳을 수정한다.

| 단계 | 파일 | 작업 |
|------|------|------|
| 1 | `types.ts` | `ListParams` 인터페이스에 optional 필드 추가 |
| 2 | `client.ts` | `if (params.xxx) url.searchParams.set(...)` 쿼리스트링 매핑 |
| 3 | `find.ts` | `FindOptions` 인터페이스 + `.option()` + action 내 전달 |

## 체크리스트

### 1. `--facilityCode` (`prfplccd`) — 공연장코드

- [ ] `types.ts`: `ListParams`에 `facilityCode?: string` 추가
- [ ] `client.ts`: `if (params.facilityCode) url.searchParams.set('prfplccd', params.facilityCode)`
- [ ] `find.ts`: `FindOptions`에 필드 추가 + `.option('--facilityCode <code>', '공연장코드 필터')` + action 전달

### 2. `--kidState` (`kidstate`) — 아동공연 여부

- [x] `types.ts`: `ListParams`에 `kidState?: boolean` 추가
- [x] `client.ts`: `if (params.kidState) url.searchParams.set('kidstate', 'Y')`
- [x] `find.ts`: `FindOptions`에 필드 추가 + `.option('--kidState', '아동공연만 조회')` (boolean 플래그) + action 전달

### 3. `--performState` (`prfstate`) — 공연상태코드

- [ ] `types.ts`: `ListParams`에 `performState?: string` 추가
- [ ] `client.ts`: `if (params.performState) url.searchParams.set('prfstate', params.performState)`
- [ ] `find.ts`: `FindOptions`에 필드 추가 + `.option('--performState <code>', '공연상태 (01:예정, 02:공연중, 03:완료)')` + action 전달

### 4. `--openRun` (`openrun`) — 오픈런 여부

- [x] `types.ts`: `ListParams`에 `openRun?: boolean` 추가
- [x] `client.ts`: `if (params.openRun) url.searchParams.set('openrun', 'Y')`
- [x] `find.ts`: `FindOptions`에 필드 추가 + `.option('--openRun', '오픈런만 조회')` (boolean 플래그) + action 전달

### 5. `--afterDate` (`afterdate`) — 등록/수정일 필터

- [x] `types.ts`: `ListParams`에 `afterDate?: string` 추가
- [x] `client.ts`: `if (params.afterDate) url.searchParams.set('afterdate', params.afterDate)`
- [x] `find.ts`: `FindOptions`에 필드 추가 + `.option('--afterDate <date>', '해당 일자 이후 등록/수정 항목만 출력 (yyyyMMdd)')` + action 전달

### 6. README 업데이트

- [ ] 옵션 테이블에 5개 파라미터 추가

### 7. 검증

- [ ] biome check 통과
- [ ] pnpm turbo build 성공
- [ ] 빌드된 CLI 실행 확인

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `packages/kopis-cli/src/kopis/types.ts` | 수정 | `ListParams`에 5개 optional 필드 추가 |
| `packages/kopis-cli/src/kopis/client.ts` | 수정 | 쿼리스트링 매핑 5건 추가 |
| `packages/kopis-cli/src/commands/find.ts` | 수정 | CLI 옵션 5건 + `FindOptions` 확장 |
| `README.md` | 수정 | 옵션 테이블 업데이트 |

## 참고

- [KOPIS OpenAPI 문서](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_1)
