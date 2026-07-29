---
"@coldsurf/tickets": patch
---

CJS 듀얼 빌드 추가 — CommonJS 소비자가 `require()` 로 사용할 수 있도록 `dist/index.cjs`(+ `index.d.cts`) 를 함께 배포하고, `exports` 에 `import`/`require` 조건과 조건별 타입 경로를 명시했습니다. (attw `CJSResolvesToESM` 경고 해소)
