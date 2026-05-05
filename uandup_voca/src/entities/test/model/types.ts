// ── Test ────────────────────────────

export type TestType = 'word-to-meaning' | 'meaning-to-word' | 'sentence';

type TestStep = 'Word' | 'Sentence' | 'Review 1' | 'Review 2' | 'Review 3';

type TestStatus =
  | 'locked' // 이전 Step 끝나지 않아 잠긴 상태
  | 'pending' // Step이 열린 후 시험이 생성되지 않은 상태
  | 'active' // 시험 생성 후 시험 시작 대기 상태
  | 'grading' // 시험 시작 후 채점 대기 중인 상태
  | 'fail' // 시험 채점 후 시험 불합격 상태
  | 'passed'; // 시험 채점 후 시험 합격 상태 ( 다음 Step Open )

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
