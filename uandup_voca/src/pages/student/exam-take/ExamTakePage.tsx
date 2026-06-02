import { useMemo, useState } from 'react';
import { useRouter, useParams, useSearch } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ConfirmDialog } from '@/shared/ui/Modal/ConfirmDialog';
import { AlertDialog } from '@/shared/ui/Modal/AlertDialog';
import { type ExamType } from '@/entities/test';
import { TestHeader, TestPagination, ProgressPanel } from '@/widgets/test-online';
import { useExamTake, inferMode, inferSource } from './model/useExamTake';
import { ExamContentTable } from './ui/ExamContentTable';

// 학생이 시험을 응시하거나 채점된 결과를 확인하는 통합 페이지.
// status === COMPLETED/PASSED/FAILED → review mode(read-only, isCorrect 마커 표시)
// status === SUBMITTED              → submitted mode(read-only, 마커 없음 — 채점 대기)
// 그 외(ONLINE_STARTED 등)          → answer mode(입력 + Submit 가능)

export default function ExamTakePage() {
  const { examId: examIdParam } = useParams({ from: '/student_/exams/$examId/take' });
  const search = useSearch({ from: '/student_/exams/$examId/take' });
  const router = useRouter();

  const routeExamId = Number(examIdParam);

  // allExamIds가 있으면 탭 전환 뷰. "examId:score,..." 형식 → { examId, score }[].
  const examAttempts: { examId: number; score: string }[] = useMemo(() => {
    if (!search.allExamIds) return [];
    return search.allExamIds
      .split(',')
      .map((part) => {
        const colonIdx = part.indexOf(':');
        const examId = Number(part.slice(0, colonIdx));
        const score = part.slice(colonIdx + 1);
        return { examId, score };
      })
      .filter((a) => !isNaN(a.examId) && a.examId > 0);
  }, [search.allExamIds]);

  const showAttemptTabs = examAttempts.length > 1;

  // --- 렌더링 상태 ---
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExamId, setSelectedExamId] = useState(routeExamId);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const examType: ExamType = (search.examType ?? 'WORD') as ExamType;
  const isSentence = examType === 'EXAMPLE';
  const source = inferSource(search.examType);
  const examId = showAttemptTabs ? selectedExamId : routeExamId;

  const {
    examDetail,
    isLoading,
    mode,
    showSynonym,
    isAnswerMode,
    doSubmit,
    vocabAnswers,
    sentenceAnswers,
    handleVocabChange,
    handleSentenceChange,
    completedIds,
    vocabPageItems,
    vocabReviewPageItems,
    sentencePageItems,
    allIds,
    totalItems,
    totalPages,
    wrongIds,
    sentenceCorrectAnswers,
    vocabReviewAnswers,
    testType,
  } = useExamTake({
    routeExamId,
    examId,
    isSentence,
    source,
    currentPage,
    onSubmitSuccess: () => setShowSubmitSuccess(true),
  });

  function doExit() {
    if (search.returnTo) {
      router.history.replace(search.returnTo);
    } else {
      router.history.back();
    }
  }

  function handleExit() {
    const currentMode = examDetail ? inferMode(examDetail.status) : 'review';
    if (currentMode === 'answer' && !showAttemptTabs) {
      setShowExitConfirm(true);
    } else {
      doExit();
    }
  }

  // 미제출 문항이 있으면 확인 모달을 먼저 표시한다 (Task 19).
  function handleSubmit() {
    if (completedIds.size < totalItems) {
      setShowSubmitConfirm(true);
      return;
    }
    doSubmit();
  }

  // 헤더 중앙: 복수 시도면 탭, 응시 중이면 경고, 나머지는 없음.
  const headerCenter = showAttemptTabs ? (
    <>
      {examAttempts.map((attempt) => (
        <button
          key={attempt.examId}
          onClick={() => setSelectedExamId(attempt.examId)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            selectedExamId === attempt.examId
              ? 'bg-primary text-white'
              : 'text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
          }`}
        >
          {attempt.score === '-' ? '-' : attempt.score}
        </button>
      ))}
    </>
  ) : isAnswerMode ? (
    <div className="flex items-center gap-1.5 text-on-surface-variant">
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
        warning
      </span>
      <p className="text-sm font-semibold">
        Your answers are not saved automatically. Refreshing or exiting this page will discard all
        progress.
      </p>
    </div>
  ) : undefined;

  // 탭 전환 히스토리 뷰에서는 실수로 제출하지 않도록 Submit 버튼을 숨긴다.
  const showSubmit = isAnswerMode && !showAttemptTabs;

  if (isLoading || !examDetail) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <TestHeader onExit={handleExit} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TestHeader
        onExit={handleExit}
        onSubmit={showSubmit ? handleSubmit : undefined}
        center={headerCenter}
      />

      <div className="relative flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          <ExamContentTable
            mode={mode}
            isSentence={isSentence}
            testType={testType}
            showSynonym={showSynonym}
            currentPage={currentPage}
            totalPages={totalPages}
            vocab={{
              pageItems: vocabPageItems,
              reviewItems: vocabReviewPageItems,
              answers: vocabAnswers,
              reviewAnswers: vocabReviewAnswers,
              wrongIds,
              onChange: handleVocabChange,
            }}
            sentence={{
              pageItems: sentencePageItems,
              answers: sentenceAnswers,
              correctAnswers: sentenceCorrectAnswers,
              onChange: handleSentenceChange,
            }}
          />

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
          wrongIds={mode === 'review' ? wrongIds : undefined}
          mode={mode === 'review' ? 'review' : 'test'}
          onQuestionClick={setCurrentPage}
        />
      </div>

      {/* 응시 중 나가기 확인 모달 */}
      {showExitConfirm && (
        <ConfirmDialog
          title="Exit Exam?"
          description="All your current answers will be lost and cannot be recovered. Are you sure you want to exit?"
          confirmLabel="Exit"
          cancelLabel="Stay"
          variant="default"
          onConfirm={doExit}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}

      {/* Task 19: 미제출 문항 확인 모달 */}
      {showSubmitConfirm && (
        <ConfirmDialog
          title="Unanswered Questions"
          description={`${totalItems - completedIds.size} question(s) are still unanswered.\nSubmit anyway?`}
          confirmLabel="Submit"
          cancelLabel="Go Back"
          onConfirm={doSubmit}
          onCancel={() => setShowSubmitConfirm(false)}
        />
      )}

      {/* Task 20: 제출 완료 모달 */}
      {showSubmitSuccess && (
        <AlertDialog
          variant="success"
          title="Submission Complete"
          description="Your answers have been submitted successfully."
          okLabel="OK"
          onClose={() => setShowSubmitSuccess(false)}
        />
      )}
    </div>
  );
}
