export function resolveApiKey(opts: { apiKey?: string }): string {
  const key = opts.apiKey || process.env.KOPIS_KEY;
  if (!key) {
    console.error(
      'Error: KOPIS API key가 필요합니다. --apiKey 또는 KOPIS_KEY 환경변수를 설정하세요.'
    );
    process.exit(1);
  }
  return key;
}
