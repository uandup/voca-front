// ── Domain Primitives ───────────────────────────────────────────────────────

export type TestType = 'word-to-meaning' | 'meaning-to-word' | 'sentence';
export type WordTestType = Exclude<TestType, 'sentence'>;

// ── Shared ──────────────────────────────────────────────────────────────────

/** TestConfigBadges, StudentDashboardStats, ClinicStudentRow에서 공통 사용 */
export interface TestConfig {
  type: WordTestType;
  includeSynonyms: boolean;
}

// ── Test Step Card ──────────────────────────────────────────────────────────

type TestStepName = 'Word' | 'Sentence' | 'Review 1' | 'Review 2' | 'Review 3';

export type StepStatus =
  | 'locked' // "Locked" 버튼, 비활성
  | 'pending' // "Pending Release" 버튼, 비활성
  | 'active' // "Start Online Test" 버튼, 활성
  | 'grading' // "Awaiting Grading" 버튼, 비활성
  | 'fail' // 점수(빨간색) + "Pending Re-Test" + "View Results"
  | 'passed'; // 점수(초록색) + "View Results"

/** StepCard — WordTestPage CycleRow, ClinicDetailPage WordTestTab */
export interface StepCardVM {
  name: TestStepName;
  status: StepStatus;
  gradedAt: string | null;
  lastScore: number | null;
  maxScore: number | null;
  retakeCount: number;
}

// ── Test Bundle Row ─────────────────────────────────────────────────────────

/** WordTestPage CycleRow / ClinicDetailPage WordTestTab row */
export interface TestBundleRow {
  id: string;
  assignedLevel: number;
  wordCount: number;
  steps: StepCardVM[];
}

// ── Test Answer ─────────────────────────────────────────────────────────────

/** 문장 시험 답안 (페이지 로컬 state) */
export interface SentenceTestAnswer {
  answer: string;
}
