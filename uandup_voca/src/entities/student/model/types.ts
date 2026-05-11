import type { Memo } from '@/entities/memo/@x/student';
import type { WordDifficultyLevel } from '@/entities/word/@x/student';
import type { TestConfig, WordTestType } from '@/entities/test/@x/student';
import type { StudentGrade } from '@/entities/member';
import type { ParentIdentity } from '@/entities/parent/@x/student';

// ── Shared Base ─────────────────────────────────────────────────────────────

export interface StudentIdentity {
  id: number;
  nameKo: string;
  nameFirstEn: string;
  nameLastEn: string;
}

// ── Student Dashboard ───────────────────────────────────────────────────────

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

// ── Clinic Detail ───────────────────────────────────────────────────────────

export interface StudentOverview {
  id: number;
  nameKo: string;
  grade: StudentGrade;
  assignedLevel: WordDifficultyLevel;
  assignmentCount: number;
  testQuestionCount: number;
  testType: WordTestType;
  includeSynonyms: boolean;
  latestMemo: Memo | null;
}

export type ExamStatus = 'READY' | 'ONLINE_STARTED' | 'SUBMITTED' | 'COMPLETED';

export interface ExamSummary {
  examId: number;
  status: ExamStatus;
  isPassed: boolean | null;
  createdAt: string | null;
  completedAt: string | null;
  correctCount: number | null;
  totalCount: number | null;
}

export interface StudySetRow {
  studySetId: number;
  level: WordDifficultyLevel;
  wordCount: number;
  assignedDate: string;
  word: ExamSummary | null;
  example: ExamSummary | null;
  review1: ExamSummary | null;
  review2: ExamSummary | null;
  review3: ExamSummary | null;
}

/** EditStudentModal */
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
