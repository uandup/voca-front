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
  createdAt: string | null;
  lastScore: number | null;
  maxScore: number | null;
  retakeCount: number;
}

// ── Test Bundle Row ─────────────────────────────────────────────────────────

// 한 study-set의 레벨 경계 횡단 배정을 표현 — 길이 > 1이면 "레벨 등업".
export interface BundleLevelCount {
  level: number;
  count: number;
}

/** WordTestPage CycleRow / ClinicDetailPage WordTestTab row */
export interface TestBundleRow {
  id: string;
  levels: BundleLevelCount[];
  wordCount: number;
  steps: StepCardVM[];
}

// ── Test Answer ─────────────────────────────────────────────────────────────

/** 문장 시험 답안 (페이지 로컬 state) */
export interface SentenceTestAnswer {
  answer: string;
}

// ── Exam Detail (Clinic Detail WordTestTab) ──────────────────────────────────

// 'REVIEW_DECK'(서버 enum: WRONG_BANK), 'LEVEL_TEST'(서버 enum: LEVEL)는
// study-set 단계 시험이 아닌 학생-단위 독립 시험. preview/review 라우트가 examType만으로
// invalidation 분기를 일관되게 처리할 수 있게 같은 enum에 둔다. 두 값 모두 자체 endpoint를
// 사용하므로 서버 CreateExamRequest.examType으로 전송되는 일은 없다.
export type ExamType =
  | 'WORD'
  | 'EXAMPLE'
  | 'REVIEW1'
  | 'REVIEW2'
  | 'REVIEW3'
  | 'REVIEW_DECK'
  | 'LEVEL_TEST';

// study-set 기반 단계 시험만 다룰 때 쓰는 좁힌 타입 — createExam/getExamsByType 같이
// 서버 enum과 직접 매핑되는 경로에서 사용. 서버 enum엔 REVIEW_DECK / LEVEL_TEST가 없다.
export type StudySetExamType = Exclude<ExamType, 'REVIEW_DECK' | 'LEVEL_TEST'>;

export interface ExamItem {
  examItemId: number;
  itemOrder: number;
  word: string;
  koreanMeaning: string;
  englishMeaning: string;
  synonyms: string[];
  example: string;
  isCorrect: boolean | null;
  userAnswer: string | null;
  synonymUserAnswers: string[];
}

export interface ExamDetail {
  examId: number;
  studySetId: number;
  subType: WordTestType | null;
  includeSynonym: boolean;
  status: string;
  isPassed: boolean | null;
  items: ExamItem[];
}

export interface ExamAttempt {
  examId: number;
  createdAt: string;
  completedAt: string | null;
  correctCount: number | null;
  totalCount: number | null;
}

export interface StepExamHistory {
  studySetId: number;
  examType: ExamType;
  currentExamId: number | null;
  currentStatus: string | null;
  isPassed: boolean | null;
  failedAttempts: ExamAttempt[];
  // 시험 생성 시점에 캡처된 설정 — 학생의 현재 설정과 별개로 시험에 고정된다.
  // 시험이 없거나(pending) 해당 필드가 없는 시험 타입(SENTENCE/REVIEW)에서는 null.
  currentQuestionCount: number | null;
  currentSubType: WordTestType | null;
  currentIncludeSynonym: boolean | null;
}
