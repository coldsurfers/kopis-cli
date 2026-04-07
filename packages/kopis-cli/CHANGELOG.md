# @coldsurf/tickets

## 0.6.0

### Minor Changes

- 011656a: 수상작 목록 조회 커맨드 (tickets award) 추가

## 0.5.0

### Minor Changes

- 47eeb8a: 기획/제작사 목록 조회 커맨드 (tickets promoter) 추가

## 0.4.0

### Minor Changes

- 179f7f9: 공연시설 상세 조회 커맨드(venue-detail) 추가

## 0.3.0

### Minor Changes

- e331219: 공연시설 목록 조회 커맨드 추가 (tickets venue)

  - `tickets venue` 커맨드로 KOPIS 공연시설 목록 조회
  - `--name`, `--venueType`, `--area`, `--subArea`, `--afterDate` 필터 지원
  - table/json 출력 포맷 지원

## 0.2.0

### Minor Changes

- b0c4973: find 커맨드에 추가 필터 옵션 지원

  - `--facilityCode`: 공연장코드 필터
  - `--performState`: 공연상태 필터 (01:예정, 02:공연중, 03:완료)
  - `--kidState`: 아동공연만 조회
  - `--openRun`: 오픈런만 조회
  - `--afterDate`: 특정 일자 이후 등록/수정 항목 필터
  - `--title`: 공연명 검색
  - `--venue`: 공연시설명 검색

## 0.1.0

### Minor Changes

- 8654f91: KOPIS 공연예술 정보 CLI 최초 릴리스

  - `find` 커맨드: 기간/장르/지역별 공연 목록 조회
  - `detail` 커맨드: 공연 ID로 상세 정보 조회
  - table/json 출력 포맷 지원
  - 지역(시도) 및 구군 단위 필터링 지원
