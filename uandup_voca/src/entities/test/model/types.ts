export type TestType = 'word-to-meaning' | 'meaning-to-word' | 'sentence';

export interface TestConfig {
  type: TestType;
  includeSynonyms: boolean;
}

export type TestStepStatus =
  | 'locked'
  | 'waiting'
  | 'available'
  | 'grading'
  | 'fail'
  | 'passed'
  | 'active'
  | 'pending';

export type TestStatus = 'pending' | 'awaiting-test' | 'awaiting-grading' | 'completed' | 'fail';

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

export interface TestRecord {
  id: string;
  date: string;
  testType: TestType;
  assignedLevel?: number;
  quantity: number;
  score: number | null;
  status: TestStatus;
}

export interface TestScore {
  score: number;
  total: number;
  date: string;
}

export interface TestItem {
  id: number;
  testId: number;
  wordId: number;
  studentAnswer: string | null;
  isCorrect: boolean | null;
}

export interface SentenceItem {
  id: number;
  sentence: string;
  answerWord?: string;
}

export interface TestInfo {
  title: string;
  subtitle: string;
  description: string;
  totalQuestions: number;
  durationSeconds: number;
}

export interface TestVocabAnswer {
  meaning: string;
  synonym: string;
}

export interface TestSentenceAnswer {
  word: string;
}
