import type { components } from '@/shared/api/schema.gen';
import type {
  WordTestType,
  ExamDetail,
  ExamItem,
  StepExamHistory,
  ExamType,
  ExamAttempt,
  ExamMode,
  ExamSource,
} from './types';
import type { WordTestItem, VocabReviewItem, SentenceTestItem } from '@/entities/word/@x/test';

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
    synonymUserAnswers: item.synonymUserAnswers ?? [],
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
    // itemOrder 오름차순으로 정렬해 화면 표시 순서를 보장한다.
    items: (r.items ?? []).map(toExamItem).sort((a, b) => a.itemOrder - b.itemOrder),
  };
}

// row 컴포넌트의 `id`는 화면 표시 번호 + React key + wrongIds 등 클라이언트 상태 추적용.
// itemOrder를 사용해 시험지 상의 의도된 번호(1~)와 일치시킨다.
export function toWordTestItems(items: ExamItem[]): WordTestItem[] {
  return items.map((item) => ({
    id: item.itemOrder,
    word: item.word,
    korMeaning: item.koreanMeaning,
    engMeaning: item.englishMeaning,
    synonyms: item.synonyms,
  }));
}

export function toVocabReviewItems(items: ExamItem[]): VocabReviewItem[] {
  return items.map((item) => ({
    id: item.itemOrder,
    word: item.word,
    korMeaning: item.koreanMeaning,
    engMeaning: item.englishMeaning,
    // 정답 synonym은 복수 — 전부 ", "로 이어서 표시.
    synonymAnswer: item.synonyms.join(', '),
  }));
}

export function toSentenceTestItems(items: ExamItem[]): SentenceTestItem[] {
  return items.map((item) => ({
    id: item.itemOrder,
    sentence: item.example,
  }));
}

// examDetail.status → 렌더링 모드 변환.
export function inferMode(status: string): ExamMode {
  if (status === 'COMPLETED' || status === 'PASSED' || status === 'FAILED') return 'review';
  if (status === 'SUBMITTED') return 'submitted';
  return 'answer';
}

// ExamType → cache invalidation / useSubmitExam 출처 변환.
export function inferSource(examType: ExamType | undefined): ExamSource {
  if (examType === 'REVIEW_DECK') return 'review-deck';
  if (examType === 'LEVEL_TEST') return 'level-test';
  return 'study-set';
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
    currentQuestionCount: r.current?.questionCount ?? null,
    currentSubType: r.current?.subType ? toWordTestType(r.current.subType) : null,
    currentIncludeSynonym: r.current?.includeSynonym ?? null,
  };
}
