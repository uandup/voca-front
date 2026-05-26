import { describe, it, expect } from 'vitest';
import { toLevelTestExamRow } from './mapper';

describe('toLevelTestExamRow', () => {
  it('유효한 status 5종이 모두 그대로 매핑된다', () => {
    const statuses = ['READY', 'IN_PROGRESS', 'SUBMITTED', 'PASSED', 'FAILED'] as const;
    for (const s of statuses) {
      expect(toLevelTestExamRow({ examId: 1, status: s }).status).toBe(s);
    }
  });

  it('알 수 없는 status는 READY로 폴백된다 (방어적 기본값)', () => {
    // 서버가 새 상태를 추가하더라도 클라이언트가 깨지지 않게 폴백.
    // schema에 없는 값을 의도적으로 넣기 위해 as never로 cast.
    expect(toLevelTestExamRow({ examId: 1, status: 'UNKNOWN_STATE' as never }).status).toBe(
      'READY',
    );
    expect(toLevelTestExamRow({ examId: 1 }).status).toBe('READY');
  });

  it('totalCount는 questionCount에서 가져온다 (wordCount 아님)', () => {
    // wordCount는 배정 총 단어 수, questionCount는 출제 문항 수 — 다를 수 있다.
    const row = toLevelTestExamRow({ examId: 1, wordCount: 100, questionCount: 20 });
    expect(row.wordCount).toBe(100);
    expect(row.questionCount).toBe(20);
    expect(row.totalCount).toBe(20);
  });

  it('correctCount는 null 보존 (시험 미완료 상태)', () => {
    expect(toLevelTestExamRow({ examId: 1 }).correctCount).toBeNull();
  });
});
