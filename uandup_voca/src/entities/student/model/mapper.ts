import type { components } from '@/shared/api/schema.gen';
import type { StudentGrade } from '@/entities/member';
import { toWordTestType } from '@/entities/test/@x/student';
import {
  toWordCardData,
  type WordDifficultyLevel,
  type WordCardData,
} from '@/entities/word/@x/student';
import type {
  StudentManageTableRow,
  StudentPickerRow,
  UnassignedStudentRow,
  StudentDetail,
  StudentOverview,
  StudySetRow,
  LevelCount,
  ExamSummary,
  ExamStatus,
  StudentDashboard,
  StudentDashboardCharts,
  ExamScorePoint,
  ExamScoreDetail,
  ExamScoreType,
  LearnedCountPoint,
  PendingReviewItem,
  TodoItem,
  TodoType,
} from './types';
import type { StepCardVM, TestBundleRow } from '@/entities/test';

type StudentListResponse = components['schemas']['StudentListResponse'];
type StudentDetailResponse = components['schemas']['StudentDetailResponse'];
type StudentOverviewResponse = components['schemas']['StudentOverviewResponse'];
type StudySetExamListResponse = components['schemas']['StudySetExamListResponse'];
type LevelCountDto = components['schemas']['LevelCount'];
type ExamSummaryDto = components['schemas']['ExamSummaryDto'];
type AssignedWordResponse = components['schemas']['AssignedWordResponse'];
type UnassignedStudentResponse = components['schemas']['UnassignedStudentResponse'];
type DashboardResponse = components['schemas']['DashboardResponse'];
type DashboardChartResponse = components['schemas']['DashboardChartResponse'];
type ExamScorePointDto = components['schemas']['ExamScorePoint'];
type DailyCountDto = components['schemas']['DailyCount'];
type PendingReviewItemDto = components['schemas']['PendingReviewItem'];
type TodoItemDto = components['schemas']['TodoItem'];

export function toAssignedWordCardData(res: AssignedWordResponse): WordCardData {
  return toWordCardData({
    id: res.wordId,
    word: res.word,
    partsOfSpeech: res.partsOfSpeech,
    koreanMeaning: res.koreanMeaning,
    englishMeaning: res.englishMeaning,
    difficulty: res.difficulty,
    synonyms: res.synonyms,
    example: res.example,
    satPriority: res.satPriority,
    examTag: res.examTag,
  });
}

export function toStudentPickerRow(r: StudentListResponse): StudentPickerRow {
  const [nameFirstEn = '', nameLastEn = ''] = (r.englishName ?? '').split(' ');
  return {
    id: r.studentId!,
    nameKo: r.name ?? '',
    nameFirstEn,
    nameLastEn,
    grade: (r.grade ?? 1) as StudentGrade,
  };
}

export function toUnassignedStudentRow(r: UnassignedStudentResponse): UnassignedStudentRow {
  return {
    id: r.studentId!,
    nameKo: r.name ?? '',
    englishName: r.englishName ?? '',
    grade: (r.grade ?? 1) as StudentGrade,
    assignmentCount: r.assignmentCount ?? 0,
    clinics: (r.clinics ?? []).map((c) => `${c.dayOfWeek ?? ''} ${c.hour ?? 0}:00`),
  };
}

export function toStudentManageTableRow(r: StudentListResponse): StudentManageTableRow {
  const [nameFirstEn = '', nameLastEn = ''] = (r.englishName ?? '').split(' ');
  const testType = toWordTestType(r.subType);
  const recentScore =
    r.recentScore != null && r.recentScoreTotal != null
      ? { score: r.recentScore, total: r.recentScoreTotal }
      : null;
  // acr은 서버가 0~100 퍼센트 값으로 내려준다 (0~1 비율이 아님) — × 100 하지 않는다.
  // 소수 첫째 자리까지 표시, 불필요한 .0은 제거 (예: 87.6% / 87%).
  const accuracy = r.acr != null ? `${+r.acr.toFixed(1)}%` : undefined;

  return {
    id: r.studentId!,
    nameKo: r.name ?? '',
    nameFirstEn,
    nameLastEn,
    grade: (r.grade ?? 1) as StudentGrade,
    classes: (r.classrooms ?? []).map((c) => c.className ?? ''),
    assignedLevel: (r.level ?? 1) as StudentManageTableRow['assignedLevel'],
    assignedWordCount: r.assignmentQty ?? 0,
    testQuestionCount: r.testItemCount ?? 0,
    testConfig: { type: testType, includeSynonyms: r.includeSynonym ?? false },
    recentScore,
    accuracy,
    latestMemoContent: r.recentMemo?.content ?? null,
    memos: [],
  };
}

// ── Clinic Detail mappers ────────────────────────────────────────────────────

function toExamSummary(dto: ExamSummaryDto): ExamSummary {
  return {
    examId: dto.examId!,
    status: (dto.status ?? 'READY') as ExamStatus,
    isPassed: dto.isPassed ?? null,
    createdAt: dto.createdAt ?? null,
    completedAt: dto.completedAt ?? null,
    correctCount: dto.correctCount ?? null,
    totalCount: dto.questionCount ?? null,
    scheduledDate: dto.scheduledDate ?? null,
  };
}

// teacher 시점 status 해석:
//   READY            → 'active'  (선생님이 시작 가능)
//   ONLINE_STARTED   → 'grading' (응시·채점 흐름 진입 가능)
//   SUBMITTED        → 'grading' (채점 대기)
//   COMPLETED        → 'passed' / 'fail'
// exams[0]이 가장 최근 시도. retakeCount = 이전 시도 수(= exams.length - 1).
function toStepCardVM(exams: ExamSummary[], isLocked: boolean): StepCardVM {
  if (isLocked) {
    return {
      name: 'Word',
      status: 'locked',
      createdAt: null,
      completedAt: null,
      lastScore: null,
      maxScore: null,
      retakeCount: 0,
      examId: null,
      lastCompletedExamId: null,
      examAttempts: [],
      scheduledDate: null,
    };
  }
  const exam = exams[0] ?? null;
  if (!exam) {
    return {
      name: 'Word',
      status: 'pending',
      createdAt: null,
      completedAt: null,
      lastScore: null,
      maxScore: null,
      retakeCount: 0,
      examId: null,
      lastCompletedExamId: null,
      examAttempts: [],
      scheduledDate: null,
    };
  }
  const {
    examId,
    status,
    isPassed,
    createdAt,
    completedAt,
    correctCount,
    totalCount,
    scheduledDate,
  } = exam;
  let stepStatus: StepCardVM['status'];
  if (status === 'COMPLETED') {
    stepStatus = isPassed ? 'passed' : 'fail';
  } else if (status === 'ONLINE_STARTED' || status === 'SUBMITTED') {
    stepStatus = 'grading';
  } else {
    stepStatus = 'active';
  }
  return {
    name: 'Word',
    status: stepStatus,
    createdAt: createdAt ?? null,
    completedAt: completedAt ?? null,
    lastScore: correctCount ?? null,
    maxScore: totalCount ?? null,
    retakeCount: exams.length - 1,
    examId,
    lastCompletedExamId: null,
    examAttempts: [],
    scheduledDate: scheduledDate ?? null,
  };
}

// student 시점 status 해석:
//   READY            → 'pending' (선생님 시작 전 — 학생은 응시 불가)
//   ONLINE_STARTED   → 'active'  (응시 가능)
//   SUBMITTED        → 'grading' (채점 대기)
//   COMPLETED        → 'passed' / 'fail'
// teacher 매퍼와 의미가 갈리는 지점은 READY / ONLINE_STARTED 뿐.
// exams[0]이 가장 최근 시도. retakeCount = 이전 시도 수(= exams.length - 1).
function toStudentStepCardVM(exams: ExamSummary[], isLocked: boolean): StepCardVM {
  if (isLocked) {
    return {
      name: 'Word',
      status: 'locked',
      createdAt: null,
      completedAt: null,
      lastScore: null,
      maxScore: null,
      retakeCount: 0,
      examId: null,
      lastCompletedExamId: null,
      examAttempts: [],
      scheduledDate: null,
    };
  }
  const exam = exams[0] ?? null;
  if (!exam) {
    return {
      name: 'Word',
      status: 'pending',
      createdAt: null,
      completedAt: null,
      lastScore: null,
      maxScore: null,
      retakeCount: 0,
      examId: null,
      lastCompletedExamId: null,
      examAttempts: [],
      scheduledDate: null,
    };
  }
  const {
    examId,
    status,
    isPassed,
    createdAt,
    completedAt,
    correctCount,
    totalCount,
    scheduledDate,
  } = exam;
  let stepStatus: StepCardVM['status'];
  if (status === 'COMPLETED') {
    stepStatus = isPassed ? 'passed' : 'fail';
  } else if (status === 'ONLINE_STARTED') {
    stepStatus = 'active';
  } else if (status === 'SUBMITTED') {
    stepStatus = 'grading';
  } else {
    // READY 등 — 선생님이 시작 안 한 상태.
    stepStatus = 'pending';
  }

  // COMPLETED 시험만 필터링. retakeCount 계산·lastCompleted 조회에 사용.
  const completedExams = exams.filter((e) => e.status === 'COMPLETED');

  // active/grading/pending 상태이면 현재 시험엔 점수가 없다.
  // 이전 fail 시도가 있으면 가장 최근 완료 시험에서 점수·completedAt을 가져와 표시한다.
  const lastCompleted = status !== 'COMPLETED' ? (completedExams[0] ?? null) : null;

  return {
    name: 'Word',
    status: stepStatus,
    createdAt: createdAt ?? null,
    completedAt: lastCompleted ? (lastCompleted.completedAt ?? null) : (completedAt ?? null),
    lastScore: lastCompleted ? (lastCompleted.correctCount ?? null) : (correctCount ?? null),
    maxScore: lastCompleted ? (lastCompleted.totalCount ?? null) : (totalCount ?? null),
    // COMPLETED 시험 수만으로 retakeCount 산정 — READY/SUBMITTED 시험은 제외.
    retakeCount: Math.max(0, completedExams.length - 1),
    examId,
    lastCompletedExamId: lastCompleted?.examId ?? null,
    // oldest → newest 순. COMPLETED/SUBMITTED 시험만 포함 — READY/ONLINE_STARTED는 미제출이므로 제외.
    examAttempts: [...exams]
      .filter((e) => e.status === 'COMPLETED' || e.status === 'SUBMITTED')
      .reverse()
      .map((e) => ({
        examId: e.examId,
        score:
          e.correctCount !== null && e.totalCount !== null
            ? `${e.correctCount}/${e.totalCount}`
            : '-',
      })),
    scheduledDate: scheduledDate ?? null,
  };
}

export function toStudentOverview(r: StudentOverviewResponse): StudentOverview {
  return {
    id: r.studentId!,
    nameKo: r.name ?? '',
    englishName: r.englishName ?? '',
    grade: (r.grade ?? 1) as StudentOverview['grade'],
    assignedLevel: (r.level ?? 1) as WordDifficultyLevel,
    assignmentCount: r.assignmentCount ?? 0,
    testQuestionCount: r.examQuestionCount ?? 0,
    testType: toWordTestType(r.examSubType),
    includeSynonyms: r.synonymIncluded ?? false,
    alreadyAssigned: r.alreadyAssigned ?? false,
    latestMemo: r.latestMemo
      ? {
          id: r.latestMemo.memoId!,
          date: r.latestMemo.date ?? '',
          content: r.latestMemo.content ?? '',
        }
      : null,
  };
}

function toLevelCount(dto: LevelCountDto): LevelCount {
  return {
    level: (dto.level ?? 1) as WordDifficultyLevel,
    count: dto.count ?? 0,
  };
}

export function toStudySetRow(r: StudySetExamListResponse): StudySetRow {
  return {
    studySetId: r.studySetId!,
    levels: (r.levels ?? []).map(toLevelCount),
    wordCount: r.wordCount ?? 0,
    assignedDate: r.assignedDate ?? '',
    word: (r.exams?.word ?? []).map(toExamSummary),
    example: (r.exams?.example ?? []).map(toExamSummary),
    review1: (r.exams?.review1 ?? []).map(toExamSummary),
    review2: (r.exams?.review2 ?? []).map(toExamSummary),
    review3: (r.exams?.review3 ?? []).map(toExamSummary),
  };
}

const STEP_NAMES: StepCardVM['name'][] = ['Word', 'Sentence', 'Review 1', 'Review 2', 'Review 3'];

export function toTestBundleRow(row: StudySetRow): TestBundleRow {
  const exams = [row.word, row.example, row.review1, row.review2, row.review3];
  let prevPassed = true;
  const steps: StepCardVM[] = exams.map((exam, i) => {
    const isLocked = !prevPassed;
    const vm = toStepCardVM(exam, isLocked);
    const named = { ...vm, name: STEP_NAMES[i] };
    prevPassed = !isLocked && named.status === 'passed';
    return named;
  });
  return {
    id: String(row.studySetId),
    levels: row.levels,
    wordCount: row.wordCount,
    steps,
  };
}

// 학생 시점의 step 상태로 변환된 cycle row. WordTestPage(student)에서 사용.
// teacher 버전과 lock 진행 로직은 동일하지만 step status 매핑이 다르다 — 위 toStudentStepCardVM 참조.
export function toStudentTestBundleRow(row: StudySetRow): TestBundleRow {
  const exams = [row.word, row.example, row.review1, row.review2, row.review3];
  let prevPassed = true;
  const steps: StepCardVM[] = exams.map((exam, i) => {
    const isLocked = !prevPassed;
    const vm = toStudentStepCardVM(exam, isLocked);
    const named = { ...vm, name: STEP_NAMES[i] };
    prevPassed = !isLocked && named.status === 'passed';
    return named;
  });
  return {
    id: String(row.studySetId),
    levels: row.levels,
    wordCount: row.wordCount,
    steps,
  };
}

export function toStudentDetail(r: StudentDetailResponse): StudentDetail {
  const [nameFirstEn = '', nameLastEn = ''] = (r.englishName ?? '').split(' ');
  const testType = toWordTestType(r.examSubType);

  return {
    id: r.studentId!,
    nameKo: r.name ?? '',
    nameFirstEn,
    nameLastEn,
    grade: (r.grade ?? 1) as StudentGrade,
    level: (r.level ?? 1) as StudentDetail['level'],
    assignmentCount: r.assignmentCount ?? 0,
    examQuestionCount: r.examQuestionCount ?? 0,
    testConfig: { type: testType, includeSynonyms: r.synonymIncluded ?? false },
    classrooms: (r.classrooms ?? []).map((c) => ({ id: c.classId!, name: c.className ?? '' })),
    parents: (r.parents ?? []).map((p) => ({
      id: p.parentId!,
      name: p.name ?? '',
      phoneNumber: p.phoneNumber ?? '',
    })),
  };
}

// ── Student Dashboard mappers ────────────────────────────────────────────────

export function toStudentDashboard(r: DashboardResponse): StudentDashboard {
  const total = r.levelTotalWordCount ?? 0;
  const memorized = r.levelMemorizedIndex ?? 0;
  return {
    currentLevel: r.currentLevel ?? null,
    levelProgressPercent: total > 0 ? Math.round((memorized / total) * 100) : 0,
    memorizedWordCount: r.memorizedWordCount ?? 0,
    // 0.0~1.0 → '85%'. COMPLETED 시험이 없으면 서버가 null로 내려준다.
    overallAccuracy:
      r.overallAccuracy != null ? `${Math.round(r.overallAccuracy * 100)}%` : undefined,
    // 진행 중 배정이 없으면 서버가 null로 내려준다.
    activeAssignment: r.activeAssignment
      ? {
          studySetId: r.activeAssignment.studySetId ?? 0,
          wordCount: r.activeAssignment.wordCount ?? 0,
        }
      : null,
    pendingReviewWordCount: r.pendingReviewWordCount ?? 0,
  };
}

// 서버 날짜 'YYYY-MM-DD' → 차트 x축 라벨 'MM.DD'.
function toChartDateLabel(iso: string): string {
  const [, month = '', day = ''] = iso.split('-');
  return `${month}.${day}`;
}

// 서버 날짜 'YYYY-MM-DD' → 월 라벨 'yy.mm' (예: '2026-05' → '26.05').
function toMonthLabel(iso: string): string {
  const [year = '2000', month = '01'] = iso.split('-');
  return `${year.slice(2)}.${month}`;
}

function toExamScoreDetail(p: ExamScorePointDto): ExamScoreDetail {
  return {
    examId: p.examId ?? 0,
    examType: (p.examType ?? 'WORD') as ExamScoreType,
    // 서버는 StudySet 정보가 없을 때 null을 내려준다 — 0으로 떨어뜨리지 않고 그대로 보존해 툴팁에서 '—'로 표시한다.
    level: p.level ?? null,
    assignedWordCount: p.assignedWordCount ?? null,
    correctCount: p.correctCount ?? 0,
    totalCount: p.totalCount ?? 0,
    accuracy: Math.round((p.accuracy ?? 0) * 100),
    isPassed: p.isPassed ?? false,
  };
}

// WORD·EXAMPLE: 날짜별 dateIndex를 부여해 같은 날 시험이 같은 x 위치에 표시되도록 한다.
// 각 시험은 개별 점으로 유지(집계하지 않음) — fail 점은 빨간 단독 점, pass 점끼리만 선 연결.
// 응답은 createdAt ASC이므로 Map 삽입 순서가 날짜 오름차순을 보장한다.
function toGroupedExamPoints(points: ExamScorePointDto[]): ExamScorePoint[] {
  const dateToIndex = new Map<string, number>();
  for (const p of points) {
    const date = p.date ?? '';
    if (!dateToIndex.has(date)) {
      dateToIndex.set(date, dateToIndex.size);
    }
  }
  return points.map((p) => {
    const detail = toExamScoreDetail(p);
    const date = p.date ?? '';
    return {
      date: toChartDateLabel(date),
      dateIndex: dateToIndex.get(date) ?? 0,
      score: detail.accuracy,
      isPassed: detail.isPassed,
      exams: [detail],
    };
  });
}

// REVIEW: 같은 날 여러 시험이 있을 수 있어 날짜별로 묶고 점수를 평균낸다.
// 응답이 createdAt ASC이므로 Map 삽입 순서가 곧 날짜 오름차순이다.
function toAveragedReviewPoints(points: ExamScorePointDto[]): ExamScorePoint[] {
  const byDate = new Map<string, ExamScoreDetail[]>();
  for (const p of points) {
    const date = p.date ?? '';
    const list = byDate.get(date) ?? [];
    list.push(toExamScoreDetail(p));
    byDate.set(date, list);
  }
  let dateIndex = 0;
  return [...byDate.entries()].map(([date, exams]) => ({
    date: toChartDateLabel(date),
    dateIndex: dateIndex++,
    score: Math.round(exams.reduce((sum, e) => sum + e.accuracy, 0) / exams.length),
    // 그날 시험이 모두 합격일 때만 합격 색으로 표시한다.
    isPassed: exams.every((e) => e.isPassed),
    exams,
  }));
}

// LearnedWords: 일별 count를 월별로 합산한다. x축 라벨은 'May'처럼 월 이름만 표시.
// 서버 응답이 날짜 ASC이면 Map 삽입 순서가 월 오름차순을 보장한다.
function toMonthlyLearnedCounts(points: DailyCountDto[]): LearnedCountPoint[] {
  const byMonth = new Map<string, number>();
  for (const p of points) {
    const iso = p.date ?? '';
    const monthKey = iso.substring(0, 7); // 'YYYY-MM'
    byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + (p.count ?? 0));
  }
  return [...byMonth.entries()].map(([monthKey, count]) => ({
    date: toMonthLabel(monthKey),
    count,
  }));
}

export function toStudentDashboardCharts(r: DashboardChartResponse): StudentDashboardCharts {
  return {
    wordScores: toGroupedExamPoints(r.wordExamScores ?? []),
    exampleScores: toGroupedExamPoints(r.exampleExamScores ?? []),
    reviewScores: toAveragedReviewPoints(r.reviewExamScores ?? []),
    // 일별 데이터를 월별로 집계해 x축 밀도를 줄이고 트렌드를 보기 쉽게 한다.
    dailyLearnedCounts: toMonthlyLearnedCounts(r.dailyLearnedCounts ?? []),
  };
}

// ── Pending Reviews mapper ───────────────────────────────────────────────────

export function toPendingReviewItem(dto: PendingReviewItemDto): PendingReviewItem {
  return {
    studySetId: dto.studySetId ?? 0,
    examId: dto.examId ?? 0,
    scheduledDate: dto.scheduledDate ?? '',
    words: (dto.words ?? []).map(toAssignedWordCardData),
  };
}

// ── Todo mapper ──────────────────────────────────────────────────────────────

export function toTodoItem(dto: TodoItemDto): TodoItem {
  return {
    type: (dto.type ?? 'WORD') as TodoType,
    examId: dto.examId ?? 0,
    studySetId: dto.studySetId ?? null,
    actionable: dto.actionable ?? false,
    scheduledDate: dto.scheduledDate ?? null,
  };
}
