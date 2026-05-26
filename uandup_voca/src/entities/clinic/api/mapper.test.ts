import { describe, it, expect } from 'vitest';
import { DAY_API_MAP } from './mapper';

describe('DAY_API_MAP', () => {
  it('클라이언트 요일 → 서버 enum 매핑이 일관적이다 (대문자 3-letter)', () => {
    expect(DAY_API_MAP).toEqual({
      Mon: 'MON',
      Tue: 'TUE',
      Wed: 'WED',
      Thu: 'THU',
      Fri: 'FRI',
      Sat: 'SAT',
    });
  });

  it('일요일(Sun)은 매핑에 없다 (클리닉 운영 안 함)', () => {
    expect((DAY_API_MAP as Record<string, string>).Sun).toBeUndefined();
  });
});
