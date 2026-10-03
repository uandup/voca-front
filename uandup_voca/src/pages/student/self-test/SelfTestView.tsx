import { useEffect, useState } from 'react';
import { useBlocker, useRouter } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ConfirmDialog } from '@/shared/ui/Modal/ConfirmDialog';
import {
  TestHeader,
  TestPagination,
  ProgressPanel,
  VocabAnswerTable,
  VocabReviewTable,
} from '@/widgets/test-online';
import { useSelfTest } from './model/useSelfTest';
import type { SelfTestWord } from './model/selfTestQuestions';
import type { SelfTestConfig } from './model/types';
import { SelfTestSetupPanel } from './ui/SelfTestSetupPanel';

// 학생 자체 시험(연습용) 화면 — 서버에 아무것도 보내지 않는 클라이언트 전용 단어 시험.
// 실제 시험(ExamTakePage)의 화면 조각(widgets/test-online)만 재사용하고, 응시 확정 POST·전체화면·
// 이탈 감독은 가져오지 않는다. 흐름: setup(설정) → testing(작성) → checked(정답 공개 + 직접 채점).
//
// 단어를 어디서 가져오는지는 모른다 — 라우트별 wrapper(routeWrappers.tsx)가 조회·어댑팅을 맡고
// 여기는 배열만 받는다. 그래서 StudySet 배정 단어와 개인 단어 세트가 같은 화면을 공유한다.

// 작성 중에는 목적지를 가리지 않고 모든 이탈을 일단 붙잡는다 — 통과 여부는 확인 모달이 정한다.
// 컴포넌트 밖에 두어 참조가 매 렌더 바뀌지 않게 한다(useBlocker의 effect 의존성).
const blockAllNavigation = () => true;

interface SelfTestViewProps {
  words: SelfTestWord[];
  isLoading?: boolean;
  // Exit 시 history.replace로 돌아갈 URL. 없으면 history.back().
  returnTo?: string;
  // 선생님이 정한 실제 시험 설정. 그 개념이 없는 묶음(개인 단어 세트)은 넘기지 않는다.
  realSettings?: SelfTestConfig;
  supportsSynonyms?: boolean;
  showRealSettingsHint?: boolean;
  setupDescription?: string;
}

export function SelfTestView({
  words,
  isLoading = false,
  returnTo,
  realSettings,
  supportsSynonyms = true,
  showRealSettingsHint = true,
  setupDescription,
}: SelfTestViewProps) {
  const router = useRouter();

  const selfTest = useSelfTest({ words, realSettings, supportsSynonyms });
  const { phase, currentPage } = selfTest;

  const [showCheckConfirm, setShowCheckConfirm] = useState(false);

  // 작성 중 이탈 방지. 답안은 메모리에만 있으므로 이탈 = 답안 소실이다.
  // 실제 시험과 같은 라우터 blocker로 트랙패드 스와이프 뒤로가기·헤더 Exit·새로고침을 한 곳에서 붙잡는다.
  // 연습이라 "포기" 개념은 없으므로, 아직 아무것도 쓰지 않았으면 막지 않고 바로 나가게 한다.
  const leaveBlocker = useBlocker({
    shouldBlockFn: blockAllNavigation,
    enableBeforeUnload: true,
    disabled: phase !== 'testing' || !selfTest.hasAnyAnswer,
    withResolver: true,
  });

  // 페이지 이동·단계 전환 시 스크롤을 최상단으로 초기화한다.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage, phase]);

  function handleExit() {
    if (returnTo) {
      router.history.replace(returnTo);
    } else {
      router.history.back();
    }
  }

  // 미작성 문항이 있으면 실제 시험 제출처럼 한 번 확인한다.
  function handleCheck() {
    if (selfTest.completedIds.size < selfTest.totalItems) {
      setShowCheckConfirm(true);
      return;
    }
    selfTest.check();
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-surface flex flex-col">
        <TestHeader onExit={handleExit} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <div className="min-h-dvh bg-surface flex flex-col">
        <TestHeader onExit={handleExit} />
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <SelfTestSetupPanel
            wordCount={selfTest.wordCount}
            config={selfTest.config}
            isCustomized={selfTest.isCustomized}
            questionCountError={selfTest.questionCountError}
            onChange={selfTest.updateConfig}
            onReset={selfTest.resetConfig}
            onStart={selfTest.start}
            description={setupDescription}
            supportsSynonyms={supportsSynonyms}
            showRealSettingsHint={showRealSettingsHint}
          />
        </div>
      </div>
    );
  }

  const isChecked = phase === 'checked';
  const correctCount = selfTest.totalItems - selfTest.wrongIds.size;

  const headerCenter = isChecked ? (
    <div className="flex items-center gap-3 min-w-0">
      <span className="shrink-0 text-sm font-bold text-on-surface">
        Score <span className="text-primary">{correctCount}</span> / {selfTest.totalItems}
      </span>
      <p className="hidden sm:block text-xs text-on-surface-variant truncate">
        Click a card to mark it wrong
      </p>
    </div>
  ) : (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
        edit_note
      </span>
      Self Test · Practice only
    </span>
  );

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <TestHeader
        onExit={handleExit}
        center={headerCenter}
        onSubmit={isChecked ? selfTest.retry : handleCheck}
        submitLabel={isChecked ? 'Try Again' : 'Check Answers'}
        submitIcon={isChecked ? 'replay' : 'fact_check'}
      />

      <div className="relative flex flex-1 justify-center px-4 xl:px-6 py-4 xl:py-4">
        <div className="w-full max-w-240 flex flex-col gap-4">
          {isChecked ? (
            // 정답 공개 — 자동 채점 없이 학생이 카드를 클릭해 오답을 표시한다(선생님 채점과 같은 방식).
            <VocabReviewTable
              items={selfTest.reviewPageItems}
              testType={selfTest.testType}
              showSynonym={selfTest.showSynonym}
              answers={selfTest.answers}
              wrongIds={selfTest.wrongIds}
              onToggleWrong={selfTest.toggleWrong}
            />
          ) : (
            <VocabAnswerTable
              items={selfTest.pageItems}
              testType={selfTest.testType}
              showSynonym={selfTest.showSynonym}
              answers={selfTest.answers}
              onAnswerChange={selfTest.handleAnswerChange}
              currentPage={currentPage}
              totalPages={selfTest.totalPages}
            />
          )}

          <TestPagination
            currentPage={currentPage}
            totalPages={selfTest.totalPages}
            onPageChange={selfTest.setCurrentPage}
          />
        </div>

        {isChecked ? (
          <ProgressPanel
            questionIds={selfTest.allIds}
            completedCount={selfTest.totalItems}
            remainingCount={0}
            completedIds={new Set(selfTest.allIds)}
            wrongIds={selfTest.wrongIds}
            mode="review"
            onQuestionClick={selfTest.setCurrentPage}
          />
        ) : (
          <ProgressPanel
            questionIds={selfTest.allIds}
            completedCount={selfTest.completedIds.size}
            remainingCount={selfTest.totalItems - selfTest.completedIds.size}
            completedIds={selfTest.completedIds}
            mode="test"
            onQuestionClick={selfTest.setCurrentPage}
          />
        )}
      </div>

      {/* 작성 중 나가기 확인 — 헤더 Exit / 스와이프·브라우저 뒤로가기 / 앱 내 이동이 모두 여기로 모인다.
          Leave → proceed()로 가로챘던 이동을 재개, Stay → reset()으로 취소. */}
      {leaveBlocker.status === 'blocked' && (
        <ConfirmDialog
          title="Leave Self Test?"
          description="Your answers will be lost."
          confirmLabel="Leave"
          cancelLabel="Stay"
          variant="danger"
          onConfirm={leaveBlocker.proceed}
          onCancel={leaveBlocker.reset}
        />
      )}

      {showCheckConfirm && (
        <ConfirmDialog
          title="Unanswered Questions"
          description={`${selfTest.totalItems - selfTest.completedIds.size} question(s) are still unanswered.\nCheck answers anyway?`}
          confirmLabel="Check Answers"
          cancelLabel="Go Back"
          onConfirm={selfTest.check}
          onCancel={() => setShowCheckConfirm(false)}
        />
      )}
    </div>
  );
}
