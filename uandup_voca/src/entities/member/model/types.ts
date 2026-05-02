import type { TestConfig } from '@/entities/test';
import type { Memo } from '@/entities/memo';
import type { WordDifficultyLevel } from '@/entities/word';

export type MemberRole = 'student' | 'teacher' | 'parent' | 'admin';
export type MemberStatus = 'pending' | 'approved' | 'rejected';

export interface BaseMember {
  id: number;
  nameKo: string;
  nameFirstEn: string;
  nameLastEn: string;
  role: MemberRole;
  status: MemberStatus;
}

// ─── Student ─────────────────────────────────────────────────────────────────

export type StudentGrade = number;

export interface Student extends BaseMember {
  role: 'student';
  grade: StudentGrade;
  classes: string[];
  clinics: string[];
  assignedLevel: WordDifficultyLevel;
  assignedWordCount: number;
  testQuestionCount: number;
  testConfig: TestConfig;
  accuracy?: string;
  recentScore?: { score: number; total: number; date: string };
  memos: Memo[];
  parentId?: number;
  parentName?: string;
  parentPhone?: string;
}

export interface PendingStudent extends BaseMember {
  role: 'student';
  grade: StudentGrade;
  submittedAt: string;
}

export interface StudentSummary {
  id: number;
  nameKo: string;
  nameFirstEn: string;
  nameLastEn: string;
  grade: StudentGrade;
}

// ─── Teacher ─────────────────────────────────────────────────────────────────

export interface Teacher extends BaseMember {
  role: 'teacher';
  isAdmin: boolean;
}

export interface PendingTeacher extends BaseMember {
  role: 'teacher';
  submittedAt: string;
}

// ─── Parent ──────────────────────────────────────────────────────────────────

export interface Parent extends BaseMember {
  role: 'parent';
  phone: string;
  matchedStudentId: number | null;
}

export interface PendingParent extends BaseMember {
  role: 'parent';
  phone: string;
  childNameKo: string;
  childGrade: string;
  matchedStudentId: number | null;
  submittedAt: string;
}

// ─── Dashboard Summary Types ──────────────────────────────────────────────────

export interface DashboardPendingStudent {
  id: number;
  nameKo: string;
  name: string;
  grade: number;
}

export interface UnassignedStudent {
  id: number;
  nameKo: string;
  name: string;
  grade: number;
  clinics: string[];
}
