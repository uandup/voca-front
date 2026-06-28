import { useMemo } from 'react';
import { ITEMS_PER_PAGE, type ExamDetail, type WordTestType } from '@/entities/test';
import type { WordTestItem, SentenceTestItem } from '@/entities/word';
import { toWordTestItems, toSentenceTestItems } from '@/entities/test';

interface UseExamItemsParams {
  examDetail: ExamDetail | undefined;
  isSentence: boolean;
  currentPage: number;
}

// answer 모드에서 필요한 아이템 변환·페이지네이션 훅.
// review 전용 데이터(wrongIds, correctAnswers 등)는 useExamReview에서 처리한다.
export function useExamItems({ examDetail, isSentence, currentPage }: UseExamItemsParams) {
  const testType: WordTestType = examDetail?.subType ?? 'word-to-meaning';

  const vocabItems: WordTestItem[] = useMemo(
    () => (!isSentence && examDetail ? toWordTestItems(examDetail.items) : []),
    [examDetail, isSentence],
  );
  const sentenceItems: SentenceTestItem[] = useMemo(
    () => (isSentence && examDetail ? toSentenceTestItems(examDetail.items) : []),
    [examDetail, isSentence],
  );

  // Word Bank용 — 전체 페이지에 걸쳐 동일하게 표시되는 정답 단어 목록.
  const sentenceWordBankItems = useMemo(
    () =>
      isSentence && examDetail
        ? examDetail.items.map((item) => ({ id: item.itemOrder, word: item.word }))
        : [],
    [examDetail, isSentence],
  );

  const totalItems = isSentence ? sentenceItems.length : vocabItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const vocabPageItems = vocabItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const sentencePageItems = sentenceItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const allIds = isSentence ? sentenceItems.map((i) => i.id) : vocabItems.map((i) => i.id);

  return {
    testType,
    vocabPageItems,
    sentencePageItems,
    sentenceWordBankItems,
    allIds,
    totalItems,
    totalPages,
  };
}
