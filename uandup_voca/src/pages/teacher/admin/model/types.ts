import type { StudentGrade } from '@/entities/member';

// ── Pending Approval ────────────────────────────────────────────────────────

export interface PendingStudent {
  id: number;
  name: string;
  englishName: string;
  grade: StudentGrade;
  submittedAt: string;
}

export interface PendingTeacher {
  id: number;
  name: string;
  englishName: string;
  submittedAt: string;
}

export interface PendingParent {
  id: number;
  name: string;
  phoneNumber: string;
  requestedChildName: string;
  requestedChildGrade: number;
  submittedAt: string;
}
