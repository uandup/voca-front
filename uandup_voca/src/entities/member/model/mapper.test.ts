import { describe, it, expect } from 'vitest';
import { toMember } from './mapper';

describe('toMember', () => {
  it('children — null/undefined일 때 undefined 보존 (STUDENT/TEACHER는 children 없음)', () => {
    // children이 빈 배열인지 undefined인지는 학부모 분기에서 의미가 다르다.
    // 학부모(자녀 0명)는 [], 학생/선생님은 undefined.
    expect(toMember({}).children).toBeUndefined();
  });

  it('children이 빈 배열이면 빈 배열로 매핑 (학부모 자녀 매칭 대기 케이스)', () => {
    expect(toMember({ role: 'PARENT', children: [] }).children).toEqual([]);
  });

  it('children이 있으면 각 항목 변환', () => {
    const result = toMember({
      role: 'PARENT',
      status: 'ACTIVE',
      children: [
        { studentId: 1, name: 'A', grade: 5 },
        { studentId: 2, name: 'B', grade: 7 },
      ],
    });
    expect(result.children).toEqual([
      { studentId: 1, name: 'A', grade: 5 },
      { studentId: 2, name: 'B', grade: 7 },
    ]);
  });

  it('role/status는 그대로 보존', () => {
    expect(toMember({ role: 'STUDENT', status: 'ACTIVE' })).toMatchObject({
      role: 'STUDENT',
      status: 'ACTIVE',
    });
  });
});
