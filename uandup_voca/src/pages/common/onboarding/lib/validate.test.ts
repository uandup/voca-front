import { describe, it, expect } from 'vitest';
import { isStudentValid, isTeacherValid, isParentValid } from './validate';
import type { StudentFormState, TeacherFormState, ParentFormState } from '../model/types';

// ── isStudentValid ─────────────────────────────────────────────────────────

describe('isStudentValid', () => {
  const valid: StudentFormState = {
    nameKo: '김민수',
    nameLastEn: 'Kim',
    nameFirstEn: 'Minsu',
    grade: 5,
  };

  it('모든 필드 채워지면 true', () => {
    expect(isStudentValid(valid)).toBe(true);
  });

  it('한국이름 누락 시 false', () => {
    expect(isStudentValid({ ...valid, nameKo: '' })).toBe(false);
  });

  it('영문 성 누락 시 false', () => {
    expect(isStudentValid({ ...valid, nameLastEn: '' })).toBe(false);
  });

  it('영문 이름 누락 시 false', () => {
    expect(isStudentValid({ ...valid, nameFirstEn: '' })).toBe(false);
  });

  it('학년 0이면 false (falsy)', () => {
    // grade는 1~12 사이의 양의 정수. 0은 미선택을 의미.
    expect(isStudentValid({ ...valid, grade: 0 as never })).toBe(false);
  });
});

// ── isTeacherValid ─────────────────────────────────────────────────────────

describe('isTeacherValid', () => {
  it('한국이름만 있으면 true (영문이름은 선택)', () => {
    const result: TeacherFormState = { nameKo: '이선생', nameLastEn: '', nameFirstEn: '' };
    expect(isTeacherValid(result)).toBe(true);
  });

  it('한국이름 없으면 false', () => {
    expect(isTeacherValid({ nameKo: '', nameLastEn: '', nameFirstEn: '' })).toBe(false);
  });
});

// ── isParentValid ──────────────────────────────────────────────────────────

describe('isParentValid', () => {
  const valid: ParentFormState = {
    nameKo: '학부모',
    phone: '01012345678',
    phoneConsent: true,
    children: [{ nameKo: '김민수', grade: 5 }],
  };

  it('모든 필드 + 자녀 1명 정상 → true', () => {
    expect(isParentValid(valid)).toBe(true);
  });

  it('phoneConsent가 false면 false (개인정보 동의 필수)', () => {
    expect(isParentValid({ ...valid, phoneConsent: false })).toBe(false);
  });

  it('자녀가 0명이면 false (최소 1명 필요)', () => {
    expect(isParentValid({ ...valid, children: [] })).toBe(false);
  });

  it('자녀 중 한 명이라도 이름 누락 → false', () => {
    expect(
      isParentValid({
        ...valid,
        children: [
          { nameKo: '김민수', grade: 5 },
          { nameKo: '', grade: 6 },
        ],
      }),
    ).toBe(false);
  });

  it('자녀 중 한 명이라도 학년 0 → false', () => {
    expect(
      isParentValid({
        ...valid,
        children: [{ nameKo: '김민수', grade: 0 as never }],
      }),
    ).toBe(false);
  });

  it('학부모 본인 이름 누락 → false', () => {
    expect(isParentValid({ ...valid, nameKo: '' })).toBe(false);
  });

  it('전화번호 누락 → false', () => {
    expect(isParentValid({ ...valid, phone: '' })).toBe(false);
  });
});
