import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams, useSearch, useNavigate } from '@tanstack/react-router';
import { ITEMS_PER_PAGE, type ExamType, type WordTestType } from '@/entities/test';
import { AlertDialog } from '@/shared/ui/Modal';
import {
  TestPagination,
  ProgressPanel,
  VocabReviewTable,
  SentenceReviewTable,
} from '@/widgets/test-online';
import type { Answer } from '@/widgets/test-online';
import { useExamDetail } from '@/entities/test';
import { toVocabReviewItems, toSentenceTestItems } from '@/entities/test';
import { toSentenceAnswers } from '@/pages/teacher/clinic-detail/model/mapper';
import { useRecordOnlineResults } from './model/useRecordOnlineResults';

// 선생님이 학생의 시험을 채점하거나 채점 결과를 확인하는 페이지(grading + result 통합).
// COMPLETED 상태로 진입 시 'result' 모드 — 채점 결과 표시. Edit 클릭으로 grading 재진입.
// 그 외 상태(ONLINE_STARTED/SUBMITTED 등)로 진입 시 'grading' 모드 — 오답 체크 → Save.
// examType === 'EXAMPLE'은 문장 시험, 그 외는 단어 시험.

type ReviewMode = 'grading' | 'result';

export default function ExamReviewPage() {
  const { examId: examIdParam } = useParams({ from: '/teacher_/exams/$examId/review' });
  const search = useSearch({ from: '/teacher_/exams/$examId/review' });
  const router = useRouter();
  const navigate = useNavigate();

  const routeExamId = Number(examIdParam);

  // allExamIds가 있으면 탭 전환 뷰. "examId:score:P/F,..." 형식 → { examId, score, isPassed }[].
  const examAttempts: { examId: number; score: string; isPassed: boolean }[] = useMemo(() => {
    if (!search.allExamIds) return [];
    return search.allExamIds
      .split(',')
      .map((part) => {
        const parts = part.split(':');
        const examId = Number(parts[0]);
        const score = parts[1] ?? '-';
        const isPassed = parts[2] === 'P';
        return { examId, score, isPassed };
      })
      .filter((a) => !isNaN(a.examId) && a.examId > 0);
  }, [search.allExamIds]);

  const showAttemptTabs = examAttempts.length > 1;
  const [selectedExamId, setSelectedExamId] = useState(routeExamId);
  const examId = showAttemptTabs ? selectedExamId : routeExamId;

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
  const [showGradingSuccess, setShowGradingSuccess] = useState(false);

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
          setShowGradingSuccess(true);
          // 탭이 있으면 URL의 allExamIds를 새 점수로 갱신 — 탭 전환 후에도 최신 점수 유지.
          if (showAttemptTabs) {
            const newScore = `${totalItems - wrongIds.size}/${totalItems}`;
            const pf = outcome === 'pass' ? 'P' : 'F';
            const updatedAllExamIds = examAttempts
              .map((a) =>
                a.examId === selectedExamId
                  ? `${a.examId}:${newScore}:${pf}`
                  : `${a.examId}:${a.score}:${a.isPassed ? 'P' : 'F'}`,
              )
              .join(',');
            navigate({
              to: '/teacher/exams/$examId/review',
              params: { examId: examIdParam },
              search: { ...search, allExamIds: updatedAllExamIds },
              replace: true,
            });
          }
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

  // sentence review용 정답 단어 map — examItem.word가 빈칸을 채울 정답.
  const sentenceCorrectAnswers: Record<number, string> = Object.fromEntries(
    examDetail.items.map((item) => [item.itemOrder, item.word]),
  );

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-outline-variant/30 px-6 h-16 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
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

        {/* 복수 시도 탭 — 각 탭에 점수 + Pass/Fail 뱃지 표시.
            선택된 탭은 URL 고정값 대신 examDetail 실시간 데이터로 오버라이드한다. */}
        {showAttemptTabs ? (
          <div className="flex items-center gap-2">
            {examAttempts.map((attempt) => {
              const isSelected = selectedExamId === attempt.examId;
              // 선택된 탭이 result 모드이면 live 데이터 사용 — 채점 수정 후 즉시 반영.
              const liveScore =
                isSelected && mode === 'result' ? `${correctCount}/${totalItems}` : attempt.score;
              const liveIsPassed =
                isSelected && mode === 'result' ? outcome === 'pass' : attempt.isPassed;

              return (
                <button
                  key={attempt.examId}
                  onClick={() => setSelectedExamId(attempt.examId)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
                  }`}
                >
                  {liveScore}
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : liveIsPassed
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error'
                    }`}
                  >
                    {liveIsPassed ? 'P' : 'F'}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* 단일 시도 — 점수/결과 텍스트 표시 */
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
        )}

        <div className="flex-1 flex justify-end items-center gap-3">
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
            // 과거 시도(selectedExamId !== routeExamId)는 수정 불가 — Edit 버튼 숨김.
            selectedExamId === routeExamId && (
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
            )
          )}
        </div>
      </header>

      <div className="relative flex-1 overflow-x-auto px-6 py-6">
        <div className="w-240 mx-auto flex flex-col gap-4">
          {isSentence ? (
            <SentenceReviewTable
              items={sentencePageItems}
              answers={sentenceAnswers}
              correctAnswers={sentenceCorrectAnswers}
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

      {/* 채점 완료 알림 — 점수와 합격 여부를 한눈에 확인한다. */}
      {showGradingSuccess && (
        <AlertDialog
          variant="success"
          title="Grading Complete!"
          description={`${correctCount} / ${totalItems} correct · ${outcome === 'pass' ? 'Passed' : 'Failed'}`}
          onClose={() => setShowGradingSuccess(false)}
        />
      )}
    </div>
  );
}
