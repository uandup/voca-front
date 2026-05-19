// ── Domain Primitives ───────────────────────────────────────────────────────

export type MemberRole = 'STUDENT' | 'TEACHER' | 'PARENT';
export type MemberStatus = 'PROFILE_INCOMPLETE' | 'PENDING_APPROVAL' | 'ACTIVE';
export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type StudentGrade = (typeof GRADES)[number];

// ── Aggregates ──────────────────────────────────────────────────────────────

export interface Member {
  role?: MemberRole;
  status?: MemberStatus;
}
