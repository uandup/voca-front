import type { StudentGrade } from '@/entities/member';

// ── Shared Base ──────────────────────────────────────────────────────────────

export interface ParentIdentity {
  id: number;
  name: string;
  phoneNumber: string;
}

// ── Admin: Parent Manage ────────────────────────────────────────────────────

export interface ParentStudentSummary {
  id: number;
  name: string;
  grade: StudentGrade;
}

export interface ParentManageRow extends ParentIdentity {
  students: ParentStudentSummary[];
}
