import type { components } from '@/shared/api/schema.gen';
import type {
  WordTestType,
  ExamDetail,
  ExamItem,
  ExamAttemptData,
  StepExamHistory,
  ExamType,
  ExamAttempt,
  ExamMode,
  ExamSource,
  SentenceTestAnswer,
  SentencePreviewItem,
} from './types';
import type { WordTestItem, VocabReviewItem, SentenceTestItem } from '@/entities/word/@x/test';

type StudySetExamTypeResponse = components['schemas']['StudySetExamTypeResponse'];
type ExamDetailResponse = components['schemas']['ExamDetailResponse'];
type ExamItemDetail = components['schemas']['ExamItemDetail'];
type ExamAttemptResponse = components['schemas']['ExamAttemptResponse'];

// 서버 시험 유형(enum) → 클라이언트 ExamType. WRONG_BANK/LEVEL만 명칭이 다르다.
function toClientExamType(t: ExamAttemptResponse['type']): ExamType {
  if (t === 'WRONG_BANK') return 'REVIEW_DECK';
  if (t === 'LEVEL') return 'LEVEL_TEST';
  return (t ?? 'WORD') as ExamType;
}

// 응시용 응답 → 클라이언트 타입. 정답 필드는 애초에 없으므로 프롬프트만 정리한다.
export function toExamAttemptData(r: ExamAttemptResponse): ExamAttemptData {
  return {
    examId: r.examId!,
    type: toClientExamType(r.type),
    subType: r.subType ? toWordTestType(r.subType) : null,
    includeSynonym: r.includeSynonym ?? false,
    totalCount: r.totalCount ?? 0,
    // itemOrder 오름차순으로 정렬해 화면 표시 순서를 보장한다.
    items: (r.items ?? [])
      .map((it) => ({
        examItemId: it.examItemId!,
        itemOrder: it.itemOrder!,
        word: it.word ?? '',
        koreanMeaning: it.koreanMeaning ?? '',
        englishMeaning: it.englishMeaning ?? '',
        example: it.example ?? '',
      }))
      .sort((a, b) => a.itemOrder - b.itemOrder),
    wordChoices: r.wordChoices ?? null,
  };
}

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
    // 미측정(키 없음)을 0으로 뭉개면 안 된다 — null(감독 안 함)과 0(감독했고 이탈 없음)은 다른 의미다.
    violationCount: r.violationCount ?? null,
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

// sentence 시험의 초기 답변 map — itemOrder를 키로 하여 SentenceReviewTable에 주입한다.
export function toSentenceAnswers(items: ExamItem[]): Record<number, SentenceTestAnswer> {
  return Object.fromEntries(
    items.map((item) => [item.itemOrder, { answer: item.userAnswer ?? '' }]),
  );
}

export function toSentencePreviewItems(items: ExamItem[]): SentencePreviewItem[] {
  return items.map((item) => ({
    id: item.itemOrder,
    sentence: item.example,
    answer: item.word,
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
