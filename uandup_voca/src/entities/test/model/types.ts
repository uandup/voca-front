// ── Test ────────────────────────────

export type TestType = 'word-to-meaning' | 'meaning-to-word' | 'sentence';

type TestStep = 'Word' | 'Sentence' | 'Review 1' | 'Review 2' | 'Review 3';
type TestStatus = 'locked' | 'grading' | 'fail' | 'passed' | 'active' | 'pending';

export type WordTestType = Exclude<TestType, 'sentence'>;

export interface TestConfig {
  type: WordTestType;
  includeSynonyms: boolean;
}

export interface TestBundle {
  id: string;
  assignedLevel: number;
  wordCount: number;
  steps: Test[];
}

export interface Test {
  name: TestStep;
  status: TestStatus;
  testType?: TestType;
  scores?: number[];
  maxScore?: number;
  failState?: 'awaiting-grading';
  createdAt?: string;
  gradedAt?: string;
}

export interface ReviewDeckTest {
  date: string;
  quantity: number;
  score: number | null;
  status: TestStatus;
}

export interface LevelTest {
  date: string;
  assignedQty: number;
  testQty: number;
  score: number | null;
  status: TestStatus;
  level: number;
}

// ── Test Answer (답안) ───────────────────────────────────────
export interface WordTestAnswer {
  answer: string;
  synonym?: string;
}

export interface SentenceTestAnswer {
  answer: string;
}
