import { useState, useCallback, useMemo } from 'react';
import {
  MOCK_VOCAB_ITEMS,
  MOCK_SENTENCE_ITEMS,
  ITEMS_PER_PAGE,
  type TestType,
  type VocabTestType,
} from '../test/mock/testMockData';
import { MOCK_ANSWERS_WTM, MOCK_ANSWERS_MTW, MOCK_SENTENCE_ANSWERS } from './mock/reviewMockData';
import { TestPagination } from '../test/ui/TestPagination';
import { ProgressPanel } from '../test/ui/ProgressPanel';
import { VocabReviewTable } from './ui/VocabReviewTable';
import { SentenceReviewTable } from './ui/SentenceReviewTable';
import { ReviewDevToolbar } from './ui/ReviewDevToolbar';

export default function TestReviewPage() {
  const [testType, setTestType] = useState<TestType>('word-to-meaning');
  const [showSynonym, setShowSynonym] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<'grading' | 'result'>('grading');
  const [isEditing, setIsEditing] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  const isSentence = testType === 'sentence';
  const sourceItems = isSentence ? MOCK_SENTENCE_ITEMS : MOCK_VOCAB_ITEMS;
  const totalItems = sourceItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const pageItems = sourceItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const mockVocabAnswers = testType === 'word-to-meaning' ? MOCK_ANSWERS_WTM : MOCK_ANSWERS_MTW;

  const checkedIds = useMemo(() => new Set(sourceItems.map((item) => item.id)), [sourceItems]);

  const handleToggleWrong = useCallback((id: number) => {
    setWrongIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleTestTypeChange = (type: TestType) => {
    setTestType(type);
    setCurrentPage(1);
    setWrongIds(new Set());
  };

  const correctCount = totalItems - wrongIds.size;
  const hideCheckbox = mode === 'result';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-outline-variant/30 px-6 h-16 flex items-center justify-between">
        {/* Left: always Exit */}
        <div className="w-24">
          <button
            onClick={() => setMode('result')}
            className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              logout
            </span>
            Exit
          </button>
        </div>

        {/* Center */}
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

        {/* Right */}
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
          ) : mode === 'result' && !isStudent ? (
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
          ) : null}
        </div>
      </header>

      <div className="relative flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          {isSentence ? (
            <SentenceReviewTable
              items={pageItems as typeof MOCK_SENTENCE_ITEMS}
              answers={MOCK_SENTENCE_ANSWERS}
              wrongIds={wrongIds}
              readOnly={mode === 'result'}
              hideCheckbox={hideCheckbox}
              onToggleWrong={handleToggleWrong}
            />
          ) : (
            <VocabReviewTable
              items={pageItems as typeof MOCK_VOCAB_ITEMS}
              testType={testType as VocabTestType}
              showSynonym={showSynonym}
              answers={mockVocabAnswers}
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
          questionIds={sourceItems.map((item) => item.id)}
          completedCount={checkedIds.size}
          remainingCount={totalItems - checkedIds.size}
          completedIds={checkedIds}
          wrongIds={wrongIds}
          mode="review"
          onQuestionClick={setCurrentPage}
        />
      </div>

      <ReviewDevToolbar
        testType={testType}
        showSynonym={showSynonym}
        mode={mode}
        isStudent={isStudent}
        onTestTypeChange={handleTestTypeChange}
        onShowSynonymChange={setShowSynonym}
        onModeChange={setMode}
        onIsStudentChange={setIsStudent}
      />
    </div>
  );
}
