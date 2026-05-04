// ── Test Type ────────────────────────────────────────────────
export type TestType = 'word-to-meaning' | 'meaning-to-word' | 'sentence';
export type WordTestType = Exclude<TestType, 'sentence'>;

// ── Test Config ──────────────────────────────────────────────
export interface TestConfig {
  type: TestType;
  includeSynonyms: boolean;
}

// ── Test Answer (답안) ───────────────────────────────────────
export interface WordTestAnswer {
  answer: string;
  synonym: string;
}

export interface SentenceTestAnswer {
  answer: string;
}

// ── Test Step / Cycle (진행 단계) ────────────────────────────
type TestStepStatus =
  | 'locked'
  | 'waiting'
  | 'available'
  | 'grading'
  | 'fail'
  | 'passed'
  | 'active'
  | 'pending';

export interface TestStep {
  key: string;
  label: string;
  status: TestStepStatus;
  testType?: TestType;
  scores?: string[];
  totalScore?: string;
  gradedDate?: string;
  scheduledDate?: string;
  subLabel?: string;
  failState?: 'fail' | 'awaiting';
  isPassed?: boolean;
  date?: string;
}

export interface TestCycle {
  id: string;
  assignedLevel: number;
  wordCount: number;
  steps: TestStep[];
}

// ── Test Record (시험 기록) ──────────────────────────────────
type TestRecordStatus = 'pending' | 'awaiting-test' | 'awaiting-grading' | 'pass' | 'fail';

export interface WrongWordTestRecord {
  date: string;
  quantity: number;
  score: number | null;
  status: TestRecordStatus;
}

export interface LevelTestRecord {
  date: string;
  assignedQty: number;
  testQty: number;
  score: number | null;
  status: TestRecordStatus;
  level: number;
}
