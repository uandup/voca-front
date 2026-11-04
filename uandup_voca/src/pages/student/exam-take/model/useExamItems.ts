import { useMemo } from 'react';
import { ITEMS_PER_PAGE, type ExamAttemptData, type WordTestType } from '@/entities/test';
import type { WordTestItem, SentenceTestItem } from '@/entities/word';

interface UseExamItemsParams {
  attempt: ExamAttemptData | undefined;
  isSentence: boolean;
  currentPage: number;
}

// answer 모드에서 필요한 아이템 변환·페이지네이션 훅.
// review 전용 데이터(wrongIds, correctAnswers 등)는 useExamReview에서 처리한다.
export function useExamItems({ attempt, isSentence, currentPage }: UseExamItemsParams) {
  const testType: WordTestType = attempt?.subType ?? 'word-to-meaning';

  // 응시용 문항은 유형별 프롬프트 필드만 채워져 있다(정답 없음). synonyms는 학생이 입력하므로 빈 배열.
  // 개인 단어 문항(오답 뱅크 혼합 시험)은 동의어가 없어 그 문항만 동의어 칸을 끈다.
  const vocabItems: WordTestItem[] = useMemo(
    () =>
      !isSentence && attempt
        ? attempt.items.map((item) => ({
            id: item.itemOrder,
            word: item.word,
            korMeaning: item.koreanMeaning,
            engMeaning: item.englishMeaning,
            synonyms: [],
            synonymDisabled: item.wordSource === 'PERSONAL',
          }))
        : [],
    [attempt, isSentence],
  );
  // 동의어 칸이 없는 문항 id(itemOrder) — useExamAnswers의 완료 판정용
  const synonymDisabledIds = useMemo(
    () => new Set(vocabItems.filter((i) => i.synonymDisabled).map((i) => i.id)),
    [vocabItems],
  );
  const sentenceItems: SentenceTestItem[] = useMemo(
    () =>
      isSentence && attempt
        ? attempt.items.map((item) => ({ id: item.itemOrder, sentence: item.example }))
        : [],
    [attempt, isSentence],
  );

  // Word Bank용 — 서버가 섞어 내려준 보기 단어(wordChoices). 문항 순서와 무관하다.
  const sentenceWordBankItems = useMemo(
    () =>
      isSentence && attempt?.wordChoices
        ? attempt.wordChoices.map((word, i) => ({ id: i, word }))
        : [],
    [attempt, isSentence],
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
    synonymDisabledIds,
  };
}
