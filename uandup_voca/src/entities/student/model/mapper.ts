import type { components } from '@/shared/api/schema.gen';
import type { StudentGrade } from '@/entities/member';
import { toWordTestType } from '@/entities/test/@x/student';
import type { WordDifficultyLevel } from '@/entities/word/@x/student';
import type {
  StudentManageTableRow,
  StudentDetail,
  StudentOverview,
  StudySetRow,
  ExamSummary,
  ExamStatus,
} from './types';
import type { StepCardVM, TestBundleRow } from '@/entities/test';

type StudentListResponse = components['schemas']['StudentListResponse'];
type StudentDetailResponse = components['schemas']['StudentDetailResponse'];
type StudentOverviewResponse = components['schemas']['StudentOverviewResponse'];
type StudySetExamListResponse = components['schemas']['StudySetExamListResponse'];
type ExamSummaryDto = components['schemas']['ExamSummaryDto'];

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
    totalCount: dto.totalCount ?? null,
  };
}

function toStepCardVM(exam: ExamSummary | null, isLocked: boolean): StepCardVM {
  if (isLocked) {
    return { name: 'Word', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 };
  }
  if (!exam) {
    return { name: 'Word', status: 'pending', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 };
  }
  const { status, isPassed, completedAt, correctCount, totalCount } = exam;
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
    gradedAt: completedAt ?? null,
    lastScore: correctCount ?? null,
    maxScore: totalCount ?? null,
    retakeCount: 0,
  };
}

export function toStudentOverview(r: StudentOverviewResponse): StudentOverview {
  return {
    id: r.studentId!,
    nameKo: r.name ?? '',
    grade: (r.grade ?? 1) as StudentOverview['grade'],
    assignedLevel: (r.level ?? 1) as WordDifficultyLevel,
    assignmentCount: r.assignmentCount ?? 0,
    testQuestionCount: r.examQuestionCount ?? 0,
    testType: toWordTestType(r.examSubType),
    includeSynonyms: r.synonymIncluded ?? false,
    latestMemo: r.latestMemo
      ? { id: r.latestMemo.memoId!, date: r.latestMemo.date ?? '', content: r.latestMemo.content ?? '' }
      : null,
  };
}

export function toStudySetRow(r: StudySetExamListResponse): StudySetRow {
  return {
    studySetId: r.studySetId!,
    level: (r.level ?? 1) as WordDifficultyLevel,
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
    assignedLevel: row.level,
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
