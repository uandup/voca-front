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

/** 학부모가 가입 신청 시 입력한 자녀 희망 정보 — 매칭 전 임시 정보. */
export interface RequestedChild {
  name: string;
  grade: number;
}

export interface PendingParent {
  id: number;
  name: string;
  phoneNumber: string;
  requestedChildren: RequestedChild[];
  submittedAt: string;
}
