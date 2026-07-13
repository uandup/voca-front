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
import { useExamTake } from './model/useExamTake';

// 학생 시험 응시 페이지 — 응시용 attempt API로 문제(정답 제외)를 받아 응시만 처리한다.
// 채점 완료(review) / 채점 대기(submitted) 결과 확인은 ExamReviewPage(/review)가 담당한다.
// 나가기·새로고침·재진입 = 포기(attempt 재호출 시 서버가 400) — 작성 답안은 저장되지 않는다.

// attempt 실패 코드를 안내 문구로 변환. 어떤 경우든 목록으로 돌려보낸다.
function getAttemptErrorMessage(error: unknown): string {
  const code = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  switch (code) {
    case 'EXAM_ALREADY_ATTEMPTED':
      return 'You have already taken this exam. It cannot be retaken.';
    case 'TEST_NOT_ONLINE_STARTED':
      return "This exam hasn't been started by your teacher yet.";
    case 'TEST_CANCELLED':
      return 'This exam has been cancelled.';
    case 'ACCESS_DENIED':
      return "You don't have access to this exam.";
    default:
      return 'This exam is no longer available.';
  }
}

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
    attempt,
    isLoading,
    error,
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

  // 응시 중 보호 장치 (모두 페이지를 벗어나면 cleanup으로 원복):
  // 1) 트랙패드 두 손가락 좌우 스와이프로 인한 실수 "뒤로가기" 차단 (overscroll-behavior-x: none).
  // 2) 문제 텍스트 드래그 선택 차단 → macOS 사전/번역(Look Up)을 무력화 (.exam-no-select).
  //    답 입력 칸(input/textarea)은 .exam-no-select 예외 규칙으로 정상 동작한다.
  // 3) 우클릭/두 손가락 탭 컨텍스트 메뉴 차단 → 메뉴의 "Look Up/Translate" 진입 차단.
  useEffect(() => {
    if (!attempt) return;
    const root = document.documentElement;
    const prevOverscroll = root.style.overscrollBehaviorX;
    root.style.overscrollBehaviorX = 'none';
    root.classList.add('exam-no-select');
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', blockContextMenu);
    return () => {
      root.style.overscrollBehaviorX = prevOverscroll;
      root.classList.remove('exam-no-select');
      document.removeEventListener('contextmenu', blockContextMenu);
    };
  }, [attempt]);

  function doExit() {
    if (search.returnTo) {
      router.history.replace(search.returnTo);
    } else {
      router.history.back();
    }
  }

  function handleExit() {
    if (attempt) {
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

  const headerCenter = attempt ? (
    <div className="flex items-center gap-1.5 text-on-surface-variant min-w-0">
      <span className="material-symbols-outlined shrink-0" style={{ fontSize: '16px' }}>
        warning
      </span>
      <p className="text-xs xl:text-sm font-semibold leading-tight line-clamp-2">
        Leaving or refreshing this page will forfeit the exam. You cannot retake it.
      </p>
    </div>
  ) : undefined;

  // attempt 실패(이미 응시함 / 시작 전 / 취소됨 / 권한 없음) → 안내 후 목록으로.
  if (error) {
    return (
      <div className="min-h-dvh bg-surface flex flex-col">
        <TestHeader onExit={doExit} />
        <AlertDialog
          variant="warning"
          title="Exam Unavailable"
          description={getAttemptErrorMessage(error)}
          okLabel="Go Back"
          onClose={doExit}
        />
      </div>
    );
  }

  if (isLoading || !attempt) {
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

      {/* 응시 중 나가기 확인 모달 — 나가기 = 포기(재응시 불가) */}
      {showExitConfirm && (
        <ConfirmDialog
          title="Exit Exam?"
          description="Leaving will forfeit this exam and you won't be able to retake it. Your current answers will not be saved. Are you sure?"
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
