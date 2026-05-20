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

/** 학생 선택 UI(picker)에서 사용하는 최소 정보. 이름·학년만 필요할 때 재사용. */
export type StudentPickerRow = StudentIdentity & {
  grade: StudentGrade;
};

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
  // 서버에서 전체 영문 이름(예: "Lee Eunsoo") 그대로 내려옴 — 표시 측에서 그대로 노출.
  englishName: string;
  grade: StudentGrade;
  assignedLevel: WordDifficultyLevel;
  assignmentCount: number;
  testQuestionCount: number;
  testType: WordTestType;
  includeSynonyms: boolean;
  // 진행 중인 NORMAL 배정 존재 여부 — true면 신규 배정 불가, "Already assigned" 상태로 표시.
  alreadyAssigned: boolean;
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

// 한 study-set이 레벨 경계를 넘어 배정될 수 있어 레벨별 단어 수를 배열로 노출한다.
// 길이 > 1이면 "레벨 등업"이 일어난 배정.
export interface LevelCount {
  level: WordDifficultyLevel;
  count: number;
}

export interface StudySetRow {
  studySetId: number;
  levels: LevelCount[];
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
