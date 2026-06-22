import type { Memo } from '@/entities/memo/@x/student';
import type { WordDifficultyLevel, WordCardData } from '@/entities/word/@x/student';
import type { TestConfig, WordTestType } from '@/entities/test/@x/student';
import type { StudentGrade } from '@/entities/member/@x/student';
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

/** 미배정 학생 모달 row — 단어를 한 번도 배정받지 못한 학생. */
export interface UnassignedStudentRow {
  id: number;
  nameKo: string;
  // 서버에서 전체 영문 이름(예: "Jisu Kang") 그대로 내려옴.
  englishName: string;
  grade: StudentGrade;
  // 배정 설정값 — 아직 배정 전이라 '시작 개수'로 사용.
  assignmentCount: number;
  // 소속 클리닉 슬롯을 "MON 13:00" 형태로 표시한 문자열 목록.
  clinics: string[];
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
  // REVIEW1/2/3 시험에만 존재. 복습 예정일 'YYYY-MM-DD'.
  scheduledDate: string | null;
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
  // 최신순 시도 이력. 시험이 없으면 빈 배열. [0]이 가장 최근 시도.
  word: ExamSummary[];
  example: ExamSummary[];
  review1: ExamSummary[];
  review2: ExamSummary[];
  review3: ExamSummary[];
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

// ── Student Dashboard (/dashboard, /dashboard/charts) ───────────────────────

/** 학생 대시보드 요약 지표 — /api/v1/students/{id}/dashboard */
export interface StudentDashboard {
  // 현재 레벨(1~10). 미배정이면 null.
  currentLevel: number | null;
  // 현재 레벨 진척률 0~100 — levelMemorizedIndex / levelTotalWordCount.
  levelProgressPercent: number;
  // 누적 암기 완료 단어 수(모든 레벨 합).
  memorizedWordCount: number;
  // 전체 정답률 — '85%' 형태. COMPLETED 시험이 없으면 undefined.
  overallAccuracy: string | undefined;
  // 진행 중 NORMAL 배정 — studySetId + wordCount. 미배정이면 null.
  activeAssignment: { studySetId: number; wordCount: number } | null;
  // 풀어야 할 리뷰 시험 단어 수.
  pendingReviewWordCount: number;
}

// ── Pending Reviews (/dashboard/pending-reviews) ────────────────────────────

/** 활성 REVIEW1/2/3 시험 1건의 단어 묶음 — scheduledDate·studySetId 오름차순 */
export interface PendingReviewItem {
  studySetId: number;
  examId: number;
  // 'YYYY-MM-DD' 형식의 리뷰 예정일
  scheduledDate: string;
  words: WordCardData[];
}

// ── Todo (/todos) ────────────────────────────────────────────────────────────

export type TodoType = 'WORD' | 'EXAMPLE' | 'REVIEW1' | 'REVIEW2' | 'REVIEW3' | 'WRONG_BANK' | 'LEVEL';

/** 학생 할 일 한 건 — /api/v1/students/{id}/todos */
export interface TodoItem {
  type: TodoType;
  examId: number;
  studySetId: number | null;
  // 지금 바로 앱에서 제출 가능한 상태(ONLINE_STARTED)이면 true, 선생님이 켜줘야 하면 false.
  actionable: boolean;
  // REVIEW1/2/3 타입만 존재. 오늘보다 이전이면 밀린 복습.
  scheduledDate: string | null;
}

export type ExamScoreType = 'WORD' | 'EXAMPLE' | 'REVIEW1' | 'REVIEW2' | 'REVIEW3';

/** 차트 point hover 시 표시할 개별 시험 정보. */
export interface ExamScoreDetail {
  examId: number;
  examType: ExamScoreType;
  // 이 시험이 속한 배정(StudySet)의 레벨. StudySet 정보가 없으면 null.
  level: number | null;
  // 이 시험이 속한 배정에 배정된 단어 수. StudySet 정보가 없으면 null.
  assignedWordCount: number | null;
  correctCount: number;
  totalCount: number;
  // 0~100 정수(반올림).
  accuracy: number;
  isPassed: boolean;
}

/** 시험 점수 추이 차트의 한 지점. */
export interface ExamScorePoint {
  // x축 라벨 'MM.DD'.
  date: string;
  // x축 슬롯 인덱스. WORD·EXAMPLE은 같은 날 시험들이 이 값을 공유해 같은 x 위치에 표시된다.
  // REVIEW는 날짜별 집계이므로 각 지점이 고유한 dateIndex를 가진다.
  dateIndex: number;
  // y값 0~100.
  score: number;
  // dot 색상용. false → 빨간 단독 점(선 미연결). true → primary 점(인접 pass끼리만 선 연결).
  isPassed: boolean;
  // 툴팁 상세 — WORD·EXAMPLE은 1건, REVIEW는 같은 날 여러 건.
  exams: ExamScoreDetail[];
}

/** 일별 암기 단어 수 차트의 한 지점. */
export interface LearnedCountPoint {
  date: string;
  count: number;
  // 월별 집계를 구성하는 일별 상세. tooltip에서 DD.MM 단위로 표시.
  dailyDetails: { date: string; count: number }[];
}

/** 학생 대시보드 차트 데이터 — /api/v1/students/{id}/dashboard/charts */
export interface StudentDashboardCharts {
  wordScores: ExamScorePoint[];
  exampleScores: ExamScorePoint[];
  reviewScores: ExamScorePoint[];
  dailyLearnedCounts: LearnedCountPoint[];
}
