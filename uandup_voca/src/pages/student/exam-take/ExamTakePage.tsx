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

// 전체화면 API 헬퍼 — Safari 구버전 webkit 프리픽스까지 커버한다.
// (시험을 전체화면으로 진행하게 해 옆에 다른 창을 띄우는 곁눈질 컨닝을 차단하기 위함.)
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
  webkitFullscreenEnabled?: boolean;
};
type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => void;
};

// iPad/iPhone Safari는 (영상 외) 전체화면 API를 지원하지 않는다 → fullscreenEnabled가 false.
// 미지원 기기에서 전체화면 가림막을 띄우면 진입이 불가능해 시험에 갇히므로, 이 값으로 게이트를 건다.
function isFullscreenSupported(): boolean {
  const d = document as FullscreenDocument;
  return Boolean(document.fullscreenEnabled ?? d.webkitFullscreenEnabled);
}

function getFullscreenElement(): Element | null {
  const d = document as FullscreenDocument;
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}
function enterFullscreen(): void {
  const el = document.documentElement as FullscreenElement;
  const fn = el.requestFullscreen ?? el.webkitRequestFullscreen;
  fn?.call(el);
}
function exitFullscreen(): void {
  if (!getFullscreenElement()) return;
  const d = document as FullscreenDocument;
  const fn = document.exitFullscreen ?? d.webkitExitFullscreen;
  fn?.call(document);
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
  // 응시 중 다른 탭/창으로 이탈했다가 돌아왔을 때 표시할 경고.
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  // 응시 중 전체화면 여부. false면 문제 위에 가림막을 띄워 전체화면 복귀를 유도한다.
  const [isFullscreen, setIsFullscreen] = useState(false);
  // 전체화면 API 미지원 기기(iPad/iPhone)에서는 가림막을 띄우지 않는다(시험에 갇히는 것 방지).
  const fullscreenSupported = isFullscreenSupported();

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

  // 응시 중 보호 장치 (모두 페이지를 벗어나면 cleanup으로 원복):
  // 1) 트랙패드 두 손가락 좌우 스와이프로 인한 실수 "뒤로가기" 차단 (overscroll-behavior-x: none).
  // 2) 문제 텍스트 드래그 선택 차단 → macOS 사전/번역(Look Up)을 무력화 (.exam-no-select).
  //    답 입력 칸(input/textarea)은 .exam-no-select 예외 규칙으로 정상 동작한다.
  // 3) 우클릭/두 손가락 탭 컨텍스트 메뉴 차단 → 메뉴의 "Look Up/Translate" 진입 차단.
  // 4) 다른 탭/창으로 이탈했다가 돌아오면 경고 표시. 탭 전환 자체는 막을 수 없어 감지 후 경고만 한다.
  //    - visibilitychange : 탭 전환·창 최소화 감지 (탭이 숨겨졌다 보일 때).
  //    - window blur/focus : 화면 분할 등 "탭은 보이지만 다른 창으로 포커스만 옮긴" 경우 감지.
  //      (didLeave 가드로 blur가 선행된 뒤의 focus 복귀에서만 경고 → 첫 포커스 오탐 방지.)
  useEffect(() => {
    if (!isAnswerMode) return;
    const root = document.documentElement;
    const prevOverscroll = root.style.overscrollBehaviorX;
    root.style.overscrollBehaviorX = 'none';
    root.classList.add('exam-no-select');
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', blockContextMenu);

    // 이탈하는 "순간"에 경고를 켠다 → 다른 창/탭을 보다가 시험으로 돌아오면 경고가 이미 떠 있다.
    //   - visibilitychange + document.hidden : 탭 전환·창 최소화
    //   - window blur                        : 화면 분할 등 다른 창으로 포커스 이동
    const onVisibilityChange = () => {
      if (document.hidden) setShowLeaveWarning(true);
    };
    const onWindowBlur = () => {
      setShowLeaveWarning(true);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);

    return () => {
      root.style.overscrollBehaviorX = prevOverscroll;
      root.classList.remove('exam-no-select');
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, [isAnswerMode]);

  // 응시 중 전체화면 상태를 추적한다. 전체화면이 아니면(=처음 진입 또는 이탈) 가림막을 띄운다.
  // 전체화면 진입은 사용자 클릭이 필요하므로 가림막의 버튼에서 enterFullscreen을 호출한다.
  // 응시 종료/이탈(cleanup) 시엔 전체화면을 해제해 결과 화면이 전체화면에 갇히지 않게 한다.
  useEffect(() => {
    if (!isAnswerMode) return;
    const update = () => setIsFullscreen(getFullscreenElement() !== null);
    update();
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);
    return () => {
      document.removeEventListener('fullscreenchange', update);
      document.removeEventListener('webkitfullscreenchange', update);
      exitFullscreen();
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

      {/* 전체화면이 아니면 문제 위에 불투명 가림막을 띄운다(z-40 — 나가기/경고 모달 z-50 아래).
          처음 진입 시엔 전체화면 시작 게이트, 이탈 후엔 복귀 유도로 동작한다.
          전체화면 강제는 불가하므로 '시험 나가기' 경로도 함께 제공해 학생이 갇히지 않게 한다. */}
      {isAnswerMode && fullscreenSupported && !isFullscreen && (
        <div className="fixed inset-0 z-40 bg-surface flex flex-col items-center justify-center gap-6 px-6 text-center">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>
            fullscreen
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-on-surface">This exam runs in fullscreen</h2>
            <p className="text-sm text-on-surface-variant max-w-md">
              To keep the test fair, please take the exam in fullscreen mode. Click the button below
              to continue.
            </p>
          </div>
          <button
            onClick={enterFullscreen}
            className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            Enter Fullscreen
          </button>
          <button
            onClick={handleExit}
            className="text-xs font-semibold text-on-surface-variant underline hover:text-on-surface"
          >
            Exit Exam
          </button>
        </div>
      )}

      {/* 응시 중 탭/창 이탈 후 복귀 시 경고 */}
      {showLeaveWarning && (
        <AlertDialog
          variant="warning"
          title="Stay on the Exam"
          description="Leaving the exam screen during the test is not allowed. Please do not switch tabs or windows."
          okLabel="OK"
          onClose={() => setShowLeaveWarning(false)}
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
