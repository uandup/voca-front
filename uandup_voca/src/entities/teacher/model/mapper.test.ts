import { describe, it, expect } from 'vitest';
import { toTeacherRow, toTeacherManageRow } from './mapper';

describe('toTeacherRow', () => {
  it('isAdmin 누락 시 false (방어적 기본값)', () => {
    expect(toTeacherRow({ teacherId: 1 }).isAdmin).toBe(false);
  });
});

describe('toTeacherManageRow', () => {
  it('2-단어 영문명 — split[0]=first, split[1]=last', () => {
    const row = toTeacherManageRow({ teacherId: 1, englishName: 'John Doe' });
    expect(row.nameFirstEn).toBe('John');
    expect(row.nameLastEn).toBe('Doe');
  });

  it('3-단어 영문명 — split[0]=first, split[1]=last, 나머지는 손실 (학생 mapper와 동일 규칙)', () => {
    const row = toTeacherManageRow({ teacherId: 1, englishName: 'John Q Doe' });
    expect(row.nameFirstEn).toBe('John');
    expect(row.nameLastEn).toBe('Q');
  });

  it('단일 단어 영문명 — first에만 들어가고 last는 빈 문자열', () => {
    const row = toTeacherManageRow({ teacherId: 1, englishName: 'John' });
    expect(row.nameFirstEn).toBe('John');
    expect(row.nameLastEn).toBe('');
  });

  it('빈 영문명 — 둘 다 빈 문자열', () => {
    expect(toTeacherManageRow({ teacherId: 1, englishName: '' }).nameFirstEn).toBe('');
    expect(toTeacherManageRow({ teacherId: 1, englishName: '' }).nameLastEn).toBe('');
  });
});
