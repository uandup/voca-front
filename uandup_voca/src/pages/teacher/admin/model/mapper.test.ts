import { describe, it, expect } from 'vitest';
import { toPendingStudent, toPendingTeacher, toPendingParent } from './mapper';

describe('toPendingStudent', () => {
  it('필수 필드 매핑', () => {
    const result = toPendingStudent({
      studentId: 1,
      name: '김민수',
      englishName: 'Minsu Kim',
      grade: 5,
      createdAt: '2026-05-01',
    });
    expect(result).toEqual({
      id: 1,
      name: '김민수',
      englishName: 'Minsu Kim',
      grade: 5,
      submittedAt: '2026-05-01',
    });
  });

  it('grade 누락 시 1로 fallback', () => {
    expect(toPendingStudent({ studentId: 1 }).grade).toBe(1);
  });
});

describe('toPendingTeacher', () => {
  it('필수 필드 매핑 (선생님은 grade 없음)', () => {
    const result = toPendingTeacher({
      teacherId: 1,
      name: '이선생',
      englishName: 'Lee',
      createdAt: '2026-05-01',
    });
    expect(result).toEqual({
      id: 1,
      name: '이선생',
      englishName: 'Lee',
      submittedAt: '2026-05-01',
    });
  });
});

describe('toPendingParent', () => {
  it('requestedChildren 빈 배열로 fallback', () => {
    expect(toPendingParent({ parentId: 1 }).requestedChildren).toEqual([]);
  });

  it('requestedChildren 매핑', () => {
    const result = toPendingParent({
      parentId: 1,
      name: '학부모',
      phoneNumber: '010',
      requestedChildren: [
        { name: '자녀1', grade: 3 },
        { name: '자녀2', grade: 5 },
      ],
    });
    expect(result.requestedChildren).toEqual([
      { name: '자녀1', grade: 3 },
      { name: '자녀2', grade: 5 },
    ]);
  });

  it('grade 누락 시 0 (학부모 매칭 신청 시점엔 학년 미확정 가능)', () => {
    // 학생 mapper와 달리 0으로 fallback — 학부모가 자녀 정보 입력 안 했을 때를 의미.
    const result = toPendingParent({
      parentId: 1,
      requestedChildren: [{ name: '자녀' }],
    });
    expect(result.requestedChildren[0].grade).toBe(0);
  });
});
