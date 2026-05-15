// ── Domain Primitives ───────────────────────────────────────────────────────

export type MemberRole = 'STUDENT' | 'TEACHER' | 'PARENT';
export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type StudentGrade = (typeof GRADES)[number];
