import { useMemo } from 'react';
import {
  ITEMS_PER_PAGE,
  type ExamMode,
  type ExamSource,
  type SentenceTestAnswer,
  type WordTestType,
  inferMode,
  useExamDetail,
} from '@/entities/test';
import { usePersonalExamDetail } from '@/entities/personal-exam';
import type { WordTestItem, VocabReviewItem, SentenceTestItem } from '@/entities/word';
import type { Answer } from '@/widgets/test-online';
import { toWordTestItems, toVocabReviewItems, toSentenceTestItems } from '@/entities/test';

interface UseExamReviewParams {
  examId: number;
  isSentence: boolean;
  currentPage: number;
  source: ExamSource;
}

// review/submitted 모드 전용 훅.
// 답안 state 없이 examDetail에서 직접 읽는다. answer 모드는 useExamTake가 담당한다.
export function useExamReview({ examId, isSentence, currentPage, source }: UseExamReviewParams) {
  // PersonalExam은 entities/test가 아니라 entities/personal-exam의 자체 detail 엔드포인트를
  // 쓴다. useExamTake의 attempt 분기와 동일한 이유로 두 훅 다 호출하되 source로 활성 쪽만 정한다.
  const testDetail = useExamDetail(source !== 'personal' ? examId : null);
  const personalDetail = usePersonalExamDetail(source === 'personal' ? examId : null);
  const { data: examDetail, isLoading } = source === 'personal' ? personalDetail : testDetail;

  const mode = examDetail ? inferMode(examDetail.status) : ('review' as ExamMode);
  const testType: WordTestType = examDetail?.subType ?? 'word-to-meaning';
  const showSynonym = examDetail?.includeSynonym ?? false;

  // submitted 모드에서 VocabAnswerTable(readOnly)에 사용.
  const vocabItems: WordTestItem[] = useMemo(
    () => (!isSentence && examDetail ? toWordTestItems(examDetail.items) : []),
    [examDetail, isSentence],
  );
  // review 모드에서 VocabReviewTable에 사용.
  const vocabReviewItems: VocabReviewItem[] = useMemo(
    () => (!isSentence && examDetail ? toVocabReviewItems(examDetail.items) : []),
    [examDetail, isSentence],
  );
  const sentenceItems: SentenceTestItem[] = useMemo(
    () => (isSentence && examDetail ? toSentenceTestItems(examDetail.items) : []),
    [examDetail, isSentence],
  );

  const totalItems = isSentence ? sentenceItems.length : vocabReviewItems.length;
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

  const allIds = isSentence ? sentenceItems.map((i) => i.id) : vocabReviewItems.map((i) => i.id);

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

  // sentence submitted 모드용 answers — examDetail에서 직접 읽어 read-only로 표시.
  const sentenceAnswers: Record<number, SentenceTestAnswer> = useMemo(() => {
    if (!examDetail) return {};
    return Object.fromEntries(
      examDetail.items.map((it) => [it.itemOrder, { answer: it.userAnswer ?? '' }]),
    );
  }, [examDetail]);

  return {
    examDetail,
    isLoading,
    mode,
    testType,
    showSynonym,
    vocabPageItems,
    vocabReviewPageItems,
    sentencePageItems,
    allIds,
    totalItems,
    totalPages,
    wrongIds,
    sentenceCorrectAnswers,
    vocabReviewAnswers,
    sentenceAnswers,
  };
}
