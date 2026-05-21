import type { components } from '@/shared/api/schema.gen';
import type { StudentGrade } from '@/entities/member';
import { toWordTestType } from '@/entities/test/@x/student';
import {
  toTeacherWord,
  type WordDifficultyLevel,
  type TeacherWord,
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

export function toAssignedTeacherWord(res: AssignedWordResponse): TeacherWord {
  return toTeacherWord({
    id: res.wordId,
    word: res.word,
    partsOfSpeech: res.partsOfSpeech,
    koreanMeaning: res.koreanMeaning,
    englishMeaning: res.englishMeaning,
    difficulty: res.difficulty,
    synonyms: res.synonyms,
    example: res.example,
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
  const accuracy = r.acr != null ? `${Math.round(r.acr * 100)}%` : undefined;

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

function toExamSummary(dto: ExamSummaryDto | null | undefined): ExamSummary | null {
  if (!dto) return null;
  return {
    examId: dto.examId!,
    status: (dto.status ?? 'READY') as ExamStatus,
    isPassed: dto.isPassed ?? null,
    createdAt: dto.createdAt ?? null,
    completedAt: dto.completedAt ?? null,
    correctCount: dto.correctCount ?? null,
    totalCount: dto.questionCount ?? null,
  };
}

// teacher 시점 status 해석:
//   READY            → 'active'  (선생님이 시작 가능)
//   ONLINE_STARTED   → 'grading' (응시·채점 흐름 진입 가능)
//   SUBMITTED        → 'grading' (채점 대기)
//   COMPLETED        → 'passed' / 'fail'
function toStepCardVM(exam: ExamSummary | null, isLocked: boolean): StepCardVM {
  if (isLocked) {
    return {
      name: 'Word',
      status: 'locked',
      createdAt: null,
      lastScore: null,
      maxScore: null,
      retakeCount: 0,
      examId: null,
    };
  }
  if (!exam) {
    return {
      name: 'Word',
      status: 'pending',
      createdAt: null,
      lastScore: null,
      maxScore: null,
      retakeCount: 0,
      examId: null,
    };
  }
  const { examId, status, isPassed, createdAt, correctCount, totalCount } = exam;
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
    lastScore: correctCount ?? null,
    maxScore: totalCount ?? null,
    retakeCount: 0,
    examId,
  };
}

// student 시점 status 해석:
//   READY            → 'pending' (선생님 시작 전 — 학생은 응시 불가)
//   ONLINE_STARTED   → 'active'  (응시 가능)
//   SUBMITTED        → 'grading' (채점 대기)
//   COMPLETED        → 'passed' / 'fail'
// teacher 매퍼와 의미가 갈리는 지점은 READY / ONLINE_STARTED 뿐.
function toStudentStepCardVM(exam: ExamSummary | null, isLocked: boolean): StepCardVM {
  if (isLocked) {
    return {
      name: 'Word',
      status: 'locked',
      createdAt: null,
      lastScore: null,
      maxScore: null,
      retakeCount: 0,
      examId: null,
    };
  }
  if (!exam) {
    return {
      name: 'Word',
      status: 'pending',
      createdAt: null,
      lastScore: null,
      maxScore: null,
      retakeCount: 0,
      examId: null,
    };
  }
  const { examId, status, isPassed, createdAt, correctCount, totalCount } = exam;
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
  return {
    name: 'Word',
    status: stepStatus,
    createdAt: createdAt ?? null,
    lastScore: correctCount ?? null,
    maxScore: totalCount ?? null,
    retakeCount: 0,
    examId,
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
    word: toExamSummary(r.exams?.word),
    example: toExamSummary(r.exams?.example),
    review1: toExamSummary(r.exams?.review1),
    review2: toExamSummary(r.exams?.review2),
    review3: toExamSummary(r.exams?.review3),
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
