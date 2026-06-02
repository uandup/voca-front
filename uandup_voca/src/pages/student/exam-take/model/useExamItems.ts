import { useMemo } from 'react';
import { ITEMS_PER_PAGE, type ExamDetail, type WordTestType } from '@/entities/test';
import type { WordTestItem, VocabReviewItem, SentenceTestItem } from '@/entities/word';
import type { Answer } from '@/widgets/test-online';
import {
  toWordTestItems,
  toSentenceTestItems,
  toVocabReviewItems,
} from '@/pages/teacher/clinic-detail/model/mapper';

interface UseExamItemsParams {
  examDetail: ExamDetail | undefined;
  isSentence: boolean;
  currentPage: number;
}

// examDetail로부터 시험 아이템을 변환·페이지네이션하는 훅.
// 표시 모드(vocab/sentence)와 현재 페이지에 따른 슬라이스, wrongIds, correctAnswers를 제공한다.
export function useExamItems({ examDetail, isSentence, currentPage }: UseExamItemsParams) {
  const testType: WordTestType = examDetail?.subType ?? 'word-to-meaning';

  const vocabItems: WordTestItem[] = useMemo(
    () => (!isSentence && examDetail ? toWordTestItems(examDetail.items) : []),
    [examDetail, isSentence],
  );
  const vocabReviewItems: VocabReviewItem[] = useMemo(
    () => (!isSentence && examDetail ? toVocabReviewItems(examDetail.items) : []),
    [examDetail, isSentence],
  );
  const sentenceItems: SentenceTestItem[] = useMemo(
    () => (isSentence && examDetail ? toSentenceTestItems(examDetail.items) : []),
    [examDetail, isSentence],
  );

  const totalItems = isSentence ? sentenceItems.length : vocabItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const vocabPageItems = vocabItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const vocabReviewPageItems = vocabReviewItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const sentencePageItems = sentenceItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const allIds = isSentence ? sentenceItems.map((i) => i.id) : vocabItems.map((i) => i.id);

  const wrongIds = new Set<number>(
    examDetail?.items.filter((i) => i.isCorrect === false).map((i) => i.itemOrder) ?? [],
  );

  // sentence review용 정답 단어 map — examItem.word가 빈칸을 채울 정답.
  const sentenceCorrectAnswers: Record<number, string> = Object.fromEntries(
    examDetail?.items.map((item) => [item.itemOrder, item.word]) ?? [],
  );

  // 단어 vocab 결과 모드용 answers map(itemOrder 기준).
  const vocabReviewAnswers: Record<number, Answer> = useMemo(() => {
    if (!examDetail) return {};
    return Object.fromEntries(
      examDetail.items.map((item) => [
        item.itemOrder,
        { answer: item.userAnswer ?? '', synonym: item.synonymUserAnswers.join(', ') },
      ]),
    );
  }, [examDetail]);

  return {
    testType,
    vocabPageItems,
    vocabReviewPageItems,
    sentencePageItems,
    allIds,
    totalItems,
    totalPages,
    wrongIds,
    sentenceCorrectAnswers,
    vocabReviewAnswers,
  };
}
