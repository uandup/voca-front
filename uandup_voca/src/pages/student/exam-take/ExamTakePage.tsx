import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearch, useNavigate } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ConfirmDialog } from '@/shared/ui/Modal/ConfirmDialog';
import { AlertDialog } from '@/shared/ui/Modal/AlertDialog';
import { type ExamType, inferSource } from '@/entities/test';
import {
  TestHeader,
  TestPagination,
  ProgressPanel,
  VocabAnswerTable,
  SentenceAnswerTable,
  SentenceWordBank,
} from '@/widgets/test-online';
import { useExamTake, inferMode } from './model/useExamTake';

// 학생 시험 응시 페이지 — answer 모드(ONLINE_STARTED)만 처리한다.
// 채점 완료(review) / 채점 대기(submitted) 결과 확인은 ExamReviewPage(/review)가 담당한다.

export default function ExamTakePage() {
  const { examId: examIdParam } = useParams({ from: '/student_/exams/$examId/take' });
  const search = useSearch({ from: '/student_/exams/$examId/take' });
  const router = useRouter();
  const navigate = useNavigate();

  const routeExamId = Number(examIdParam);
  const examType: ExamType = (search.examType ?? 'WORD') as ExamType;
  const isSentence = examType === 'EXAMPLE';
  const source = inferSource(search.examType);

  // --- 렌더링 상태 ---
  const [currentPage, setCurrentPage] = useState(1);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  const {
    examDetail,
    isLoading,
    isAnswerMode,
    showSynonym,
    doSubmit,
    vocabAnswers,
    sentenceAnswers,
    handleVocabChange,
    handleSentenceChange,
    completedIds,
    vocabPageItems,
    sentencePageItems,
    sentenceWordBankItems,
    allIds,
    totalItems,
    totalPages,
    testType,
  } = useExamTake({
    routeExamId,
    examId: routeExamId,
    isSentence,
    source,
    currentPage,
    // 제출 완료 후 성공 모달을 먼저 표시하고, 확인 클릭 시 /review로 교체 이동한다.
    onSubmitSuccess: () => setShowSubmitSuccess(true),
  });

  // 페이지 전환 시 스크롤을 최상단으로 초기화한다.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  // 응시 중 MacBook 트랙패드 두 손가락 좌우 스와이프로 인한 실수 "뒤로가기"를 막는다.
  // overscroll-behavior-x: none 은 가로 오버스크롤을 페이지 내비게이션으로 해석하지 않게 한다.
  // 페이지를 벗어나면(cleanup) 원래 값으로 복원해 앱 전역 동작은 그대로 둔다.
  useEffect(() => {
    if (!isAnswerMode) return;
    const root = document.documentElement;
    const prev = root.style.overscrollBehaviorX;
    root.style.overscrollBehaviorX = 'none';
    return () => {
      root.style.overscrollBehaviorX = prev;
    };
  }, [isAnswerMode]);

  function doExit() {
    if (search.returnTo) {
      router.history.replace(search.returnTo);
    } else {
      router.history.back();
    }
  }

  function handleExit() {
    const currentMode = examDetail ? inferMode(examDetail.status) : 'review';
    if (currentMode === 'answer') {
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

  const headerCenter = isAnswerMode ? (
    <div className="flex items-center gap-1.5 text-on-surface-variant min-w-0">
      <span className="material-symbols-outlined shrink-0" style={{ fontSize: '16px' }}>
        warning
      </span>
      <p className="text-xs xl:text-sm font-semibold leading-tight line-clamp-2">
        Your answers are not saved automatically. Refreshing or exiting this page will discard all
        progress.
      </p>
    </div>
  ) : undefined;

  if (isLoading || !examDetail) {
    return (
      <div className="min-h-dvh bg-surface flex flex-col">
        <TestHeader onExit={handleExit} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <TestHeader onExit={handleExit} onSubmit={handleSubmit} center={headerCenter} />

      <div className="relative flex flex-1 justify-center px-4 xl:px-6 py-4 xl:py-4">
        <div className="w-full max-w-240 flex flex-col gap-4">
          {isSentence ? (
            <>
              <SentenceWordBank items={sentenceWordBankItems} />
              <SentenceAnswerTable
                items={sentencePageItems}
                answers={sentenceAnswers}
                onAnswerChange={handleSentenceChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </>
          ) : (
            <VocabAnswerTable
              items={vocabPageItems}
              testType={testType}
              showSynonym={showSynonym}
              answers={vocabAnswers}
              onAnswerChange={handleVocabChange}
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
          questionIds={allIds}
          completedCount={completedIds.size}
          remainingCount={totalItems - completedIds.size}
          completedIds={completedIds}
          mode="test"
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
          variant="danger"
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

      {/* 제출 완료 모달 — 확인 클릭 시 /review로 교체 이동 */}
      {showSubmitSuccess && (
        <AlertDialog
          variant="success"
          title="Submission Complete"
          description="Your answers have been submitted successfully."
          okLabel="OK"
          onClose={() => {
            setShowSubmitSuccess(false);
            navigate({
              to: '/student/exams/$examId/review',
              params: { examId: examIdParam },
              search: { returnTo: search.returnTo, examType: search.examType },
              replace: true,
            });
          }}
        />
      )}
    </div>
  );
}
