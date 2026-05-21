// ── Domain Primitives ───────────────────────────────────────────────────────

export type MemberRole = 'STUDENT' | 'TEACHER' | 'PARENT';
export type MemberStatus = 'PROFILE_INCOMPLETE' | 'PENDING_APPROVAL' | 'ACTIVE';
export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type StudentGrade = (typeof GRADES)[number];

// ── Aggregates ──────────────────────────────────────────────────────────────

/** 학부모에 연결된 자녀(학생) 요약. */
export interface ChildSummary {
  studentId: number;
  name: string;
  grade: StudentGrade;
}

export interface Member {
  role?: MemberRole;
  status?: MemberStatus;
  // 연결된 자녀 목록 — PARENT만 채워진다. 자녀가 없는 학부모는 빈 배열,
  // STUDENT·TEACHER는 undefined. 학부모의 "자녀 매칭 대기" 분기에 사용한다.
  children?: ChildSummary[];
}
