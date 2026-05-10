import type { Memo } from '@/entities/memo/@x/member';
import type { WordDifficultyLevel } from '@/entities/word/@x/member';
import type { TestConfig } from '@/entities/test/@x/member';

// ── Domain Primitives ───────────────────────────────────────────────────────

export type MemberRole = 'STUDENT' | 'TEACHER' | 'PARENT';
export type MemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type StudentGrade = (typeof GRADES)[number];

// ── Shared Base ─────────────────────────────────────────────────────────────

interface StudentIdentity {
  id: number;
  nameKo: string;
  nameFirstEn: string;
  nameLastEn: string;
}

export interface ParentIdentity {
  id: number;
  name: string;
  phoneNumber: string;
}

// ── Student Dashboard ───────────────────────────────────────────────────────

/** Student Dashboard — "Welcome back, {nameFirstEn}" 헤더 */
export interface StudentDashboardHeader {
  nameFirstEn: string;
}

/** Student Dashboard — StatCards + LevelProgress */
export interface StudentDashboardStats {
  assignedLevel: WordDifficultyLevel;
  assignedWordCount: number;
  accuracy: string | undefined;
  testConfig: TestConfig;
}

/** Student Dashboard — TodoList 드로어 */
export interface StudentTodoConfig {
  assignedWordCount: number;
}

// ── Teacher: Clinics Page ───────────────────────────────────────────────────

/** ClinicsPage 우측 테이블 row */
export type ClinicStudentRow = StudentIdentity & {
  grade: StudentGrade;
  assignedLevel: WordDifficultyLevel;
  assignedWordCount: number;
  testQuestionCount: number;
  testConfig: TestConfig;
  latestMemoContent: string | null;
};

/** ClinicDetailPage 상단 StudentInfoCard */
export type ClinicStudentProfileCard = StudentIdentity & {
  grade: StudentGrade;
  latestMemo: { date: string; content: string } | null;
};

// ── Teacher: Student Manage Page ────────────────────────────────────────────

/** StudentManagePage 테이블 row */
export type StudentManageTableRow = StudentIdentity & {
  grade: StudentGrade;
  classes: string[];
  assignedLevel: WordDifficultyLevel;
  assignedWordCount: number;
  testQuestionCount: number;
  testConfig: TestConfig;
  recentScore: { score: number; total: number } | null;
  accuracy: string | undefined;
  latestMemoContent: string | null;
  memos: Memo[]; // ClinicsPage/ClinicDetailPage에서 사용 — clinics API 연동 시 제거 예정
};

/** EditStudentModal  */
export interface StudentDetail {
  id: number;
  nameKo: string;
  nameFirstEn: string;
  nameLastEn: string;
  grade: StudentGrade;
  level: WordDifficultyLevel;
  assignmentCount: number;
  examQuestionCount: number;
  testConfig: TestConfig;
  classrooms: { id: number; name: string }[];
  parents: ParentIdentity[];
}

// ── Teacher: Dashboard ──────────────────────────────────────────────────────

/** TeacherDashboard UnassignedStudentsModal list item */
export type UnassignedStudentListItem = StudentIdentity & {
  grade: StudentGrade;
  clinics: string[];
};

// ── Onboarding Forms ────────────────────────────────────────────────────────

/** Onboarding StudentForm 입력 상태 */
export interface StudentFormState {
  nameKo: string;
  nameLastEn: string;
  nameFirstEn: string;
  grade: StudentGrade;
}

/** Onboarding TeacherForm 입력 상태 */
export interface TeacherFormState {
  nameKo: string;
  nameLastEn: string;
  nameFirstEn: string;
}

/** Onboarding ParentForm 입력 상태 */
export interface ParentFormState {
  nameKo: string;
  phone: string;
  phoneConsent: boolean;
  childNameKo: string;
  childGrade: StudentGrade;
}

/** Admin PendingApprovalsModal StudentMatchPanel — 등록된 학생 목록 */
export type RegisteredStudentRow = StudentIdentity & {
  grade: StudentGrade;
};

// ── Admin: Pending Approval ─────────────────────────────────────────────────

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

export interface PendingParent extends ParentIdentity {
  requestedChildName: string;
  requestedChildGrade: number;
  submittedAt: string;
}

// ── Admin: Teacher Permission ───────────────────────────────────────────────

export interface TeacherRow {
  id: number;
  name: string;
  englishName: string;
  isAdmin: boolean;
}

// ── Admin: Teacher / Parent Manage ──────────────────────────────────────────

export interface TeacherManageRow {
  id: number;
  name: string;
  nameFirstEn: string;
  nameLastEn: string;
  isAdmin: boolean;
}

export interface ParentStudentSummary {
  id: number;
  name: string;
  grade: StudentGrade;
}

export interface ParentManageRow extends ParentIdentity {
  students: ParentStudentSummary[];
}
