import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCurrentClinicHour,
  getTimeGroupOfHour,
  ALL_CLINIC_HOURS,
  TIME_GROUPS,
} from './schedule';

// ── getTimeGroupOfHour ──────────────────────────────────────────────────────

describe('getTimeGroupOfHour', () => {
  it('Morning hours (9, 10, 11) → "morning"', () => {
    expect(getTimeGroupOfHour(9)).toBe('morning');
    expect(getTimeGroupOfHour(10)).toBe('morning');
    expect(getTimeGroupOfHour(11)).toBe('morning');
  });

  it('Afternoon hours (13, 14, 15, 16) → "afternoon"', () => {
    expect(getTimeGroupOfHour(13)).toBe('afternoon');
    expect(getTimeGroupOfHour(16)).toBe('afternoon');
  });

  it('Evening hours (18~22) → "evening"', () => {
    expect(getTimeGroupOfHour(18)).toBe('evening');
    expect(getTimeGroupOfHour(22)).toBe('evening');
  });
});

// ── ALL_CLINIC_HOURS / TIME_GROUPS 무결성 ───────────────────────────────────

describe('schedule 상수 무결성', () => {
  it('ALL_CLINIC_HOURS는 그룹 hours를 평탄화한 결과와 같다', () => {
    const expected = TIME_GROUPS.flatMap((g) => [...g.hours]);
    expect([...ALL_CLINIC_HOURS]).toEqual(expected);
  });

  it('clinic 운영 시간엔 점심(12)·5시(17) 빈 구간이 있다', () => {
    // 12·17은 학원 일정상 의도적으로 제외 — getCurrentClinicHour 동작과 직결되는 사실.
    expect((ALL_CLINIC_HOURS as readonly number[]).includes(12)).toBe(false);
    expect((ALL_CLINIC_HOURS as readonly number[]).includes(17)).toBe(false);
  });
});

// ── getCurrentClinicHour — Asia/Seoul 기준 동작 ──────────────────────────────

describe('getCurrentClinicHour', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('현재 시각이 9시면 9 (오전 시작)', () => {
    // UTC 00시 = Asia/Seoul 09시.
    vi.setSystemTime(new Date('2026-05-26T00:00:00Z'));
    expect(getCurrentClinicHour()).toBe(9);
  });

  it('현재 시각이 점심(12시)이면 다음 운영 시간인 13으로 폴백', () => {
    // 운영 시간에 12가 없으니 "현재 시 이상인 첫 시간"인 13을 반환.
    vi.setSystemTime(new Date('2026-05-26T03:00:00Z')); // 12시 KST
    expect(getCurrentClinicHour()).toBe(13);
  });

  it('현재 시각이 17시(빈 구간)이면 다음인 18로 폴백', () => {
    vi.setSystemTime(new Date('2026-05-26T08:00:00Z')); // 17시 KST
    expect(getCurrentClinicHour()).toBe(18);
  });

  it('현재 시각이 운영 종료 후(23시 등)이면 마지막 시간(22)으로 폴백', () => {
    vi.setSystemTime(new Date('2026-05-26T14:00:00Z')); // 23시 KST
    expect(getCurrentClinicHour()).toBe(22);
  });

  it('새벽(KST 02시)이면 첫 운영 시간 9로 폴백', () => {
    vi.setSystemTime(new Date('2026-05-25T17:00:00Z')); // 02시 KST 다음날
    expect(getCurrentClinicHour()).toBe(9);
  });
});
