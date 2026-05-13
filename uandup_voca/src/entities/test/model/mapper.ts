import type { components } from '@/shared/api/schema.gen';
import type {
  WordTestType,
  ExamDetail,
  ExamItem,
  StepExamHistory,
  ExamType,
  ExamAttempt,
} from './types';

type StudySetExamTypeResponse = components['schemas']['StudySetExamTypeResponse'];
type ExamDetailResponse = components['schemas']['ExamDetailResponse'];
type ExamItemDetail = components['schemas']['ExamItemDetail'];

export function toWordTestType(
  subType: 'WORD_TO_MEANING' | 'MEANING_TO_WORD' | string | undefined,
): WordTestType {
  return subType === 'WORD_TO_MEANING' ? 'word-to-meaning' : 'meaning-to-word';
}

function toExamItem(item: ExamItemDetail): ExamItem {
  return {
    examItemId: item.examItemId!,
    itemOrder: item.itemOrder!,
    word: item.word ?? '',
    koreanMeaning: item.koreanMeaning ?? '',
    englishMeaning: item.englishMeaning ?? '',
    synonyms: item.synonyms ?? [],
    example: item.example ?? '',
    isCorrect: item.isCorrect ?? null,
    userAnswer: item.userAnswer ?? null,
  };
}

export function toExamDetail(r: ExamDetailResponse): ExamDetail {
  return {
    examId: r.examId!,
    studySetId: r.studySetId!,
    subType: r.subType ? toWordTestType(r.subType) : null,
    includeSynonym: r.includeSynonym ?? false,
    status: r.status ?? '',
    isPassed: r.isPassed ?? null,
    items: (r.items ?? []).map(toExamItem),
  };
}

export function toStepExamHistory(r: StudySetExamTypeResponse): StepExamHistory {
  const attempts: ExamAttempt[] = (r.failedAttempts ?? []).map((a) => ({
    examId: a.examId!,
    createdAt: a.createdAt ?? '',
    completedAt: a.completedAt ?? null,
    correctCount: a.correctCount ?? null,
    totalCount: a.totalCount ?? null,
  }));
  return {
    studySetId: r.studySetId!,
    examType: (r.examType ?? 'WORD') as ExamType,
    currentExamId: r.current?.examId ?? null,
    currentStatus: r.current?.status ?? null,
    isPassed: r.current?.isPassed ?? null,
    failedAttempts: attempts,
  };
}
