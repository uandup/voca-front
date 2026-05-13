import { useCallback, useMemo, useState } from 'react';
import { useRouter, useParams, useSearch } from '@tanstack/react-router';
import {
  MOCK_VOCAB_REVIEW_ITEMS,
  MOCK_SENTENCE_ITEMS,
  ITEMS_PER_PAGE,
  MOCK_ANSWERS_WTM,
  MOCK_SENTENCE_ANSWERS,
  type WordTestType,
} from '@/entities/test';
import {
  TestPagination,
  ProgressPanel,
  VocabReviewTable,
  SentenceReviewTable,
} from '@/widgets/test-online';

// 선생님이 학생 답안을 온라인 채점하는 페이지.
// grading mode에서 오답 체크 → Grade(저장) 또는 Edit(재채점) 흐름을 가진다.
// 데이터는 이번 범위에선 mock 사용. 추후 examId로 실제 답안 페칭 + recordOnlineResults mutation 연동 예정.

type ReviewMode = 'grading' | 'result';

export default function ExamGradeOnlinePage() {
  const { examId } = useParams({ from: '/teacher_/exams/$examId/grade-online' });
  const { returnTo } = useSearch({ from: '/teacher_/exams/$examId/grade-online' });
  const router = useRouter();

  void examId;

  // returnTo가 있으면 replace로 history의 grade-online 엔트리를 덮어써, 앞으로가기로 재진입할 수 없게 한다.
  function handleExit() {
    if (returnTo) {
      router.history.replace(returnTo);
    } else {
      router.history.back();
    }
  }

  // mock: word-to-meaning 단어 시험 가정. 추후 examType에 따라 분기.
  const testType: WordTestType = 'word-to-meaning';
  const isSentence = false;

  const [currentPage, setCurrentPage] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<ReviewMode>('grading');
  const [isEditing, setIsEditing] = useState(false);

  const vocabItems = MOCK_VOCAB_REVIEW_ITEMS;
  const sentenceItems = MOCK_SENTENCE_ITEMS;
  const totalItems = isSentence ? sentenceItems.length : vocabItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const vocabPageItems = vocabItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const sentencePageItems = sentenceItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const allIds = isSentence ? sentenceItems.map((i) => i.id) : vocabItems.map((i) => i.id);
  const checkedIds = useMemo(() => new Set<number>(allIds), [isSentence]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleWrong = useCallback((id: number) => {
    setWrongIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const correctCount = totalItems - wrongIds.size;
  const hideCheckbox = mode === 'result';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* grading-specific 헤더 — Exit + correct/wrong count + Grade/Save/Edit */}
      <header className="sticky top-0 z-10 bg-white border-b border-outline-variant/30 px-6 h-16 flex items-center justify-between">
        <div className="w-24">
          <button
            onClick={handleExit}
            className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              logout
            </span>
            Exit
          </button>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'result' ? (
            <span className="text-sm font-bold text-on-surface">
              {correctCount} / {totalItems} correct
            </span>
          ) : (
            <>
              <span className="text-sm font-semibold text-on-surface">
                {correctCount} / {totalItems}
              </span>
              <span className="text-on-surface-variant/30">·</span>
              <span className="text-sm text-error font-semibold">{wrongIds.size} wrong</span>
            </>
          )}
        </div>

        <div className="w-24 flex justify-end">
          {mode === 'grading' && !isEditing ? (
            <button
              onClick={() => setMode('result')}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                grade
              </span>
              Grade
            </button>
          ) : mode === 'grading' && isEditing ? (
            <button
              onClick={() => {
                setMode('result');
                setIsEditing(false);
              }}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                save
              </span>
              Save
            </button>
          ) : (
            <button
              onClick={() => {
                setMode('grading');
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                edit
              </span>
              Edit
            </button>
          )}
        </div>
      </header>

      <div className="relative flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          {isSentence ? (
            <SentenceReviewTable
              items={sentencePageItems}
              answers={MOCK_SENTENCE_ANSWERS}
              wrongIds={wrongIds}
              readOnly={mode === 'result'}
              hideCheckbox={hideCheckbox}
              onToggleWrong={handleToggleWrong}
            />
          ) : (
            <VocabReviewTable
              items={vocabPageItems}
              testType={testType}
              showSynonym
              answers={MOCK_ANSWERS_WTM}
              wrongIds={wrongIds}
              readOnly={mode === 'result'}
              hideCheckbox={hideCheckbox}
              onToggleWrong={handleToggleWrong}
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
          completedCount={checkedIds.size}
          remainingCount={totalItems - checkedIds.size}
          completedIds={checkedIds}
          wrongIds={wrongIds}
          mode="review"
          onQuestionClick={setCurrentPage}
        />
      </div>
    </div>
  );
}
