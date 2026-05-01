import type { TestConfig } from '@/entities/test';
import type { Memo } from '@/entities/memo';
import type { WordDifficultyLevel } from '@/entities/word';

export type MemberRole = 'student' | 'teacher' | 'parent' | 'admin';
export type MemberStatus = 'pending' | 'approved' | 'rejected';

export interface BaseMember {
  id: number;
  nameFirstEn: string;
  nameLastEn: string;
  nameFirstKo: string;
  nameLastKo: string;
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
