import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// 테스트는 src/ 안의 *.test.ts 파일을 co-located로 두는 방식 (mapper.ts ↔ mapper.test.ts).
// JSDOM이 필요 없는 pure function 테스트만 우선 도입 — DOM 의존이 생기면 environment를 'jsdom'으로 전환.
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
