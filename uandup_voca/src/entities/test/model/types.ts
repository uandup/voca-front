// ── Domain Primitives ───────────────────────────────────────────────────────

export type TestType = 'word-to-meaning' | 'meaning-to-word' | 'sentence';
export type WordTestType = Exclude<TestType, 'sentence'>;

// 시험 응시 페이지의 렌더링 모드. examDetail.status로부터 inferMode()로 결정.
export type ExamMode = 'answer' | 'review' | 'submitted';
// useSubmitExam / cache invalidation에서 사용하는 시험 출처 구분.
export type ExamSource = 'study-set' | 'review-deck' | 'level-test';

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
  | 'grading' // ONLINE_STARTED — 학생이 응시 중, 채점 흐름 진입 가능
  | 'submitted' // SUBMITTED — 학생이 제출 완료, 선생님 채점 대기
  | 'fail' // 점수(빨간색) + "Pending Re-Test" + "View Results"
  | 'passed' // 점수(초록색) + "View Results"
  | 'skipped'; // 선생님이 시험 없이 스킵한 단계 — "Skipped" 표시, 다음 단계 잠금 해제

/** StepCard — WordTestPage CycleRow, ClinicDetailPage WordTestTab */
export interface StepCardVM {
  name: TestStepName;
  status: StepStatus;
  createdAt: string | null;
  // 채점 완료 일시. 학생 StepCard의 "Graded At" 표시에 사용. null이면 표시 안 함.
  completedAt: string | null;
  lastScore: number | null;
  maxScore: number | null;
  retakeCount: number;
  // 학생 WordTestPage가 step 카드의 Start Test / View Results 버튼에서 응시 페이지로 직접 이동할 때 사용.
  // step에 시험이 아직 없으면(pending/locked) null. teacher 측 StepPanel은 별도 examHistory를 fetch하므로 무관.
  examId: number | null;
  // pending/active/grading 상태에서 "View Results" 클릭 시 기본으로 열 exam ID (가장 최근 COMPLETED 시험).
  // 현재 시험이 이미 COMPLETED이거나 이전 기록이 없으면 null. teacher 측은 null.
  lastCompletedExamId: number | null;
  // 이 step의 모든 시도 목록 (oldest→newest). examId + 점수 레이블. 탭 전환 UI에 사용. teacher 측은 [].
  examAttempts: { examId: number; score: string }[];
  // REVIEW1/2/3 시험에만 존재. 복습 예정일 'YYYY-MM-DD'. 나머지 step은 null.
  scheduledDate: string | null;
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

/** 문장 시험 preview row — SentencePreviewTable에 주입되는 데이터 단위. */
export interface SentencePreviewItem {
  id: number;
  sentence: string;
  answer: string;
}

/** 문장 시험 인쇄·채점용 row — 시험지/채점지의 한 줄. widgets/test-offline 출력 + clinic-detail mapper에서 공유. */
export interface ESRow {
  no: string;
  sentence: string;
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
