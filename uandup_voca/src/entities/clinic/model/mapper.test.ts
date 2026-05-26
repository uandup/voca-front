import { describe, it, expect } from 'vitest';
import { toClinicStudentRow } from './mapper';

describe('toClinicStudentRow', () => {
  // ⚠️ 학생/선생님 mapper와 *다른 파싱 규칙* — 자세한 내용은 entities/student/model/mapper.test.ts 참조.
  it('2-단어 영문명 — last word=성, 첫 단어=이름', () => {
    const row = toClinicStudentRow({ studentId: 1, englishName: 'Minsu Kim' });
    expect(row.nameFirstEn).toBe('Minsu');
    expect(row.nameLastEn).toBe('Kim');
  });

  it('3-단어 영문명 — last word=성, 그 외 모두=이름 (학생 mapper와 다르게 정보 손실 없음)', () => {
    // 같은 입력에 대해 학생 mapper는 "Min" / "Su"인데 clinic은 "Min Su" / "Kim".
    const row = toClinicStudentRow({ studentId: 1, englishName: 'Min Su Kim' });
    expect(row.nameFirstEn).toBe('Min Su');
    expect(row.nameLastEn).toBe('Kim');
  });

  it('단일 단어 영문명 — last는 빈 문자열, first에 통째로', () => {
    const row = toClinicStudentRow({ studentId: 1, englishName: 'Minsu' });
    expect(row.nameFirstEn).toBe('Minsu');
    expect(row.nameLastEn).toBe('');
  });

  it('latestMemoContent — recentMemo.content가 없으면 null', () => {
    expect(toClinicStudentRow({ studentId: 1 }).latestMemoContent).toBeNull();
  });

  it('latestMemoContent — recentMemo가 있으면 content 추출', () => {
    expect(
      toClinicStudentRow({ studentId: 1, recentMemo: { content: 'note' } }).latestMemoContent,
    ).toBe('note');
  });

  it('testConfig는 toWordTestType을 통해 변환된다', () => {
    expect(
      toClinicStudentRow({ studentId: 1, subType: 'WORD_TO_MEANING' }).testConfig.type,
    ).toBe('word-to-meaning');
  });

  it('includeSynonym 기본값은 false', () => {
    expect(toClinicStudentRow({ studentId: 1 }).testConfig.includeSynonyms).toBe(false);
  });
});
