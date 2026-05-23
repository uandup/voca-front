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

/** 학생의 시험 설정 — members/me 응답에서 STUDENT만 의미 있게 채워진다. */
export interface MemberExamSettings {
  // 시험 유형. STUDENT가 아니면 null.
  examSubType: 'WORD_TO_MEANING' | 'MEANING_TO_WORD' | null;
  includeSynonyms: boolean;
  // 시험 1회 문항 수.
  examQuestionCount: number;
  // 1회 배정 단어 수.
  assignmentCount: number;
}

export interface Member {
  role?: MemberRole;
  status?: MemberStatus;
  name?: string;
  // 연결된 자녀 목록 — PARENT만 채워진다. 자녀가 없는 학부모는 빈 배열,
  // STUDENT·TEACHER는 undefined. 학부모의 "자녀 매칭 대기" 분기에 사용한다.
  children?: ChildSummary[];
  // 시험 설정 — STUDENT 본인 대시보드에서 Test Configuration 표시에 쓴다.
  examSettings: MemberExamSettings;
}
