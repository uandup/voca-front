import { useState, useCallback, useMemo } from 'react';
import {
  MOCK_VOCAB_ITEMS,
  MOCK_SENTENCE_ITEMS,
  ITEMS_PER_PAGE,
  type TestType,
  type VocabTestType,
} from './mock/testMockData';
import { TestHeader } from './ui/TestHeader';
import { VocabAnswerTable } from './ui/VocabAnswerTable';
import { SentenceAnswerTable } from './ui/SentenceAnswerTable';
import { TestPagination } from './ui/TestPagination';
import { ProgressPanel } from './ui/ProgressPanel';
import { DevToolbar } from './ui/DevToolbar';
import type { Answer } from './ui/VocabAnswerRow';
import type { SentenceAnswer } from './ui/SentenceAnswerRow';

export default function TestPage() {
  const [testType, setTestType] = useState<TestType>('word-to-meaning');
  const [showSynonym, setShowSynonym] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [vocabAnswers, setVocabAnswers] = useState<Record<number, Answer>>({});
  const [sentenceAnswers, setSentenceAnswers] = useState<Record<number, SentenceAnswer>>({});

  const isSentence = testType === 'sentence';
  const sourceItems = isSentence ? MOCK_SENTENCE_ITEMS : MOCK_VOCAB_ITEMS;
  const totalItems = sourceItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const pageItems = sourceItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const completedIds = useMemo(() => {
    if (isSentence) {
      return new Set(
        Object.entries(sentenceAnswers)
          .filter(([, a]) => a.word.trim() !== '')
          .map(([id]) => Number(id)),
      );
    }
    return new Set(
      Object.entries(vocabAnswers)
        .filter(([, a]) => {
          const meaningFilled = a.meaning.trim() !== '';
          return showSynonym ? meaningFilled && a.synonym.trim() !== '' : meaningFilled;
        })
        .map(([id]) => Number(id)),
    );
  }, [isSentence, vocabAnswers, sentenceAnswers, showSynonym]);

  const completedCount = completedIds.size;
  const remainingCount = totalItems - completedCount;

  const handleVocabAnswerChange = useCallback((id: number, field: keyof Answer, value: string) => {
    setVocabAnswers((prev) => ({
      ...prev,
      [id]: { ...{ meaning: '', synonym: '' }, ...prev[id], [field]: value },
    }));
  }, []);

  const handleSentenceAnswerChange = useCallback((id: number, value: string) => {
    setSentenceAnswers((prev) => ({ ...prev, [id]: { word: value } }));
  }, []);

  const handleTestTypeChange = (type: TestType) => {
    setTestType(type);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TestHeader />

      <div className="relative flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          {isSentence ? (
            <SentenceAnswerTable
              items={pageItems as typeof MOCK_SENTENCE_ITEMS}
              answers={sentenceAnswers}
              onAnswerChange={handleSentenceAnswerChange}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          ) : (
            <VocabAnswerTable
              items={pageItems as typeof MOCK_VOCAB_ITEMS}
              testType={testType as VocabTestType}
              showSynonym={showSynonym}
              answers={vocabAnswers}
              onAnswerChange={handleVocabAnswerChange}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}

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

      <DevToolbar
        testType={testType}
        showSynonym={showSynonym}
        onTestTypeChange={handleTestTypeChange}
        onShowSynonymChange={setShowSynonym}
      />
    </div>
  );
}
