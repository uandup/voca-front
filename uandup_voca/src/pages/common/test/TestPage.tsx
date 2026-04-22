import { useState, useCallback, useMemo } from 'react';
import { MOCK_VOCAB_ITEMS, ITEMS_PER_PAGE } from './mock/testMockData';
import { TestHeader } from './ui/TestHeader';
import { VocabAnswerRow, type Answer } from './ui/VocabAnswerRow';
import { TestPagination } from './ui/TestPagination';
import { ProgressPanel } from './ui/ProgressPanel';

export default function TestPage() {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = MOCK_VOCAB_ITEMS.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const pageItems = MOCK_VOCAB_ITEMS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const completedIds = useMemo(
    () =>
      new Set(
        Object.entries(answers)
          .filter(([, a]) => a.primaryMeaning.trim() !== '' && a.synonym.trim() !== '')
          .map(([id]) => Number(id)),
      ),
    [answers],
  );

  const completedCount = completedIds.size;
  const remainingCount = totalItems - completedCount;

  const handleAnswerChange = useCallback((id: number, field: keyof Answer, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...{ primaryMeaning: '', synonym: '' }, ...prev[id], [field]: value },
    }));
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TestHeader />

      <div className="relative flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-4">
            <div className="flex flex-col gap-2">
              {pageItems.map((item) => (
                <VocabAnswerRow
                  key={item.id}
                  id={item.id}
                  word={item.word}
                  answer={answers[item.id]}
                  onAnswerChange={handleAnswerChange}
                />
              ))}
            </div>
          </div>

          <TestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <ProgressPanel
          completedCount={completedCount}
          remainingCount={remainingCount}
          totalItems={totalItems}
          completedIds={completedIds}
          onQuestionClick={setCurrentPage}
        />
      </div>
    </div>
  );
}
