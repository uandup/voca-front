import { useMemo, useState } from 'react';
import { useRouter, useParams } from '@tanstack/react-router';
import {
  MOCK_VOCAB_REVIEW_ITEMS,
  MOCK_SENTENCE_ITEMS,
  ITEMS_PER_PAGE,
  MOCK_ANSWERS_WTM,
  MOCK_SENTENCE_ANSWERS,
  type WordTestType,
} from '@/entities/test';
import {
  TestHeader,
  TestPagination,
  ProgressPanel,
  VocabReviewTable,
  SentenceReviewTable,
} from '@/widgets/test-online';

// 선생님이 학생이 풀게 될 시험 화면을 미리 확인하는 페이지.
// VocabReviewTable / SentenceReviewTable을 readOnly + hideCheckbox로 활용하여
// 정답이 채워진 상태(answers 채워짐, 채점 체크박스 없음)로 표시한다.
// 데이터는 이번 범위에선 mock 사용. 추후 examId로 실제 데이터 페칭 연동 예정.

export default function ExamPreviewPage() {
  const { examId } = useParams({ from: '/teacher_/exams/$examId/preview' });
  const router = useRouter();

  // examId는 향후 실제 API 연동 시 사용 — 현재는 mock 데이터.
  void examId;

  // mock: word-to-meaning 단어 시험 가정. sentence variant는 추후 시험 메타로 분기.
  const testType: WordTestType = 'word-to-meaning';
  const isSentence = false;

  const [currentPage, setCurrentPage] = useState(1);

  const sourceItems = isSentence ? MOCK_SENTENCE_ITEMS : MOCK_VOCAB_REVIEW_ITEMS;
  const totalItems = sourceItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const vocabPageItems = MOCK_VOCAB_REVIEW_ITEMS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const sentencePageItems = MOCK_SENTENCE_ITEMS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const allIds = sourceItems.map((item) => item.id);
  const completedIds = useMemo(() => new Set<number>(allIds), [isSentence]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TestHeader onExit={() => router.history.back()} />

      <div className="relative flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          {isSentence ? (
            <SentenceReviewTable
              items={sentencePageItems}
              answers={MOCK_SENTENCE_ANSWERS}
              wrongIds={new Set()}
              readOnly
              hideCheckbox
              onToggleWrong={() => {}}
            />
          ) : (
            <VocabReviewTable
              items={vocabPageItems}
              testType={testType}
              showSynonym
              answers={MOCK_ANSWERS_WTM}
              wrongIds={new Set()}
              readOnly
              hideCheckbox
              onToggleWrong={() => {}}
            />
          )}

          <TestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <ProgressPanel
          questionIds={allIds}
          completedCount={completedIds.size}
          remainingCount={totalItems - completedIds.size}
          completedIds={completedIds}
          mode="review"
          onQuestionClick={setCurrentPage}
        />
      </div>
    </div>
  );
}
