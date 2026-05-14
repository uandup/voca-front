import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams, useSearch } from '@tanstack/react-router';
import { ITEMS_PER_PAGE, type ExamType, type WordTestType } from '@/entities/test';
import {
  TestPagination,
  ProgressPanel,
  VocabReviewTable,
  SentenceReviewTable,
} from '@/widgets/test-online';
import type { Answer } from '@/widgets/test-online';
import { useExamDetail } from '@/pages/teacher/clinic-detail/model/hooks/useExamDetail';
import {
  toVocabReviewItems,
  toSentenceTestItems,
  toSentenceAnswers,
} from '@/pages/teacher/clinic-detail/model/mapper';
import { useRecordOnlineResults } from './model/hooks/useRecordOnlineResults';

// 선생님이 학생의 시험을 채점하거나 채점 결과를 확인하는 페이지(grading + result 통합).
// COMPLETED 상태로 진입 시 'result' 모드 — 채점 결과 표시. Edit 클릭으로 grading 재진입.
// 그 외 상태(ONLINE_STARTED/SUBMITTED 등)로 진입 시 'grading' 모드 — 오답 체크 → Save.
// examType === 'EXAMPLE'은 문장 시험, 그 외는 단어 시험.

type ReviewMode = 'grading' | 'result';

export default function ExamReviewPage() {
  const { examId: examIdParam } = useParams({ from: '/teacher_/exams/$examId/review' });
  const search = useSearch({ from: '/teacher_/exams/$examId/review' });
  const router = useRouter();

  const examId = Number(examIdParam);
  const { data: examDetail, isLoading } = useExamDetail(examId);

  const examType: ExamType = (search.examType ?? 'WORD') as ExamType;
  const isSentence = examType === 'EXAMPLE';

  const recordResults = useRecordOnlineResults({
    examId,
    studentId: search.studentId ?? 0,
    studySetId: search.studySetId ?? 0,
    examType,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<ReviewMode>('grading');
  const [isEditing, setIsEditing] = useState(false);
  // 합격 여부는 선생님이 명시적으로 선택. 채점 완료된 시험으로 재진입 시 기존 값으로 초기화.
  const [outcome, setOutcome] = useState<'pass' | 'fail'>('pass');

  // examDetail 로드 시 초기 상태 동기화 — 이미 채점된 시험이면 result 모드 + 기존 오답/합격 표시.
  // wrongIds는 itemOrder를 키로 추적한다(row id와 일치). 채점 mutation을 보낼 땐 examItemId로 다시 매핑.
  useEffect(() => {
    if (!examDetail) return;
    if (examDetail.status === 'COMPLETED') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode('result');
      setWrongIds(
        new Set(examDetail.items.filter((i) => i.isCorrect === false).map((i) => i.itemOrder)),
      );
      setOutcome(examDetail.isPassed === true ? 'pass' : 'fail');
    } else {
      setMode('grading');
      setWrongIds(new Set());
    }
  }, [examDetail]);

  const handleToggleWrong = useCallback((id: number) => {
    setWrongIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  function handleExit() {
    if (search.returnTo) {
      router.history.replace(search.returnTo);
    } else {
      router.history.back();
    }
  }

  function handleSaveResults() {
    if (!examDetail) return;
    // wrongIds는 itemOrder 기준 — examItemId로 매핑해 API 페이로드를 만든다.
    const results = examDetail.items.map((item) => ({
      examItemId: item.examItemId,
      isCorrect: !wrongIds.has(item.itemOrder),
      userAnswer: item.userAnswer ?? '',
    }));
    recordResults.mutate(
      { results, isPassed: outcome === 'pass' },
      {
        onSuccess: () => {
          setMode('result');
          setIsEditing(false);
        },
      },
    );
  }

  // VocabReviewRow가 사용하는 answers map — row.id(itemOrder)로 lookup하므로 itemOrder를 키로 한다.
  const vocabAnswers: Record<number, Answer> = useMemo(() => {
    if (!examDetail) return {};
    return Object.fromEntries(
      examDetail.items.map((item) => [
        item.itemOrder,
        {
          answer: item.userAnswer ?? '',
          synonym: item.synonymUserAnswers.join(', '),
        },
      ]),
    );
  }, [examDetail]);

  if (isLoading || !examDetail) {
    return <></>;
  }

  const testType: WordTestType = examDetail.subType ?? 'word-to-meaning';
  const showSynonym = examDetail.includeSynonym;

  const vocabItems = !isSentence ? toVocabReviewItems(examDetail.items) : [];
  const sentenceItems = isSentence ? toSentenceTestItems(examDetail.items) : [];
  const sentenceAnswers = isSentence ? toSentenceAnswers(examDetail.items) : {};

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
  const checkedIds = new Set<number>(allIds);
  const correctCount = totalItems - wrongIds.size;
  const hideCheckbox = mode === 'result';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
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
            <>
              <span className="text-sm font-bold text-on-surface">
                {correctCount} / {totalItems} correct
              </span>
              <span className="text-on-surface-variant/30">·</span>
              <span
                className={`text-sm font-bold ${outcome === 'pass' ? 'text-success' : 'text-error'}`}
              >
                {outcome === 'pass' ? 'Passed' : 'Failed'}
              </span>
            </>
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

        <div className="flex justify-end items-center gap-3">
          {mode === 'grading' && (
            // Pass/Fail segmented toggle — isPassed로 mutation에 전달된다.
            <div
              role="radiogroup"
              aria-label="Outcome"
              className="flex items-center rounded-lg border border-outline-variant/30 overflow-hidden"
            >
              <button
                role="radio"
                aria-checked={outcome === 'pass'}
                onClick={() => setOutcome('pass')}
                className={`px-3 py-2 text-sm font-bold transition-colors ${
                  outcome === 'pass'
                    ? 'bg-success text-white'
                    : 'bg-white text-on-surface-variant hover:bg-slate-50'
                }`}
              >
                Pass
              </button>
              <button
                role="radio"
                aria-checked={outcome === 'fail'}
                onClick={() => setOutcome('fail')}
                className={`px-3.5 py-2 text-sm font-bold transition-colors border-l border-outline-variant/30 ${
                  outcome === 'fail'
                    ? 'bg-error text-white'
                    : 'bg-white text-on-surface-variant hover:bg-slate-50'
                }`}
              >
                Fail
              </button>
            </div>
          )}

          {mode === 'grading' ? (
            <button
              onClick={handleSaveResults}
              disabled={recordResults.isPending}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {isEditing ? 'save' : 'grade'}
              </span>
              {isEditing ? 'Save' : 'Grade'}
            </button>
          ) : (
            <button
              onClick={() => {
                setMode('grading');
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
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
              answers={sentenceAnswers}
              wrongIds={wrongIds}
              readOnly={mode === 'result'}
              hideCheckbox={hideCheckbox}
              onToggleWrong={handleToggleWrong}
            />
          ) : (
            <VocabReviewTable
              items={vocabPageItems}
              testType={testType}
              showSynonym={showSynonym}
              answers={vocabAnswers}
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
