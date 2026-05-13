import { useState } from 'react';
import type { StepCardVM, WordTestType } from '@/entities/test';
import { useExamDetail } from '../../../model/hooks/useExamDetail';
import { TestResultModal } from '../modals/TestResultModal';

// 채점이 완료되어 통과한 단계에서 렌더링된다.
// inferPhase가 'passed'를 반환하는 경우 — step.status === 'passed'
// (서버 상태 COMPLETED + isPassed=true).
// 주된 액션: View Results (읽기 전용).
// 소유 모달: TestResultModal.

interface Props {
  step: StepCardVM;
  currentExamId: number | null;
  testType: WordTestType;
  includeSynonyms: boolean;
}

export function PassedPanel({ step, currentExamId, testType, includeSynonyms }: Props) {
  const [showResult, setShowResult] = useState(false);

  const { data: examDetail } = useExamDetail(showResult ? currentExamId : null);

  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.createdAt && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.createdAt}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span className="flex items-center gap-1.5">
            Score :{' '}
            {step.lastScore !== null ? (
              <span className="font-semibold text-success">
                {step.lastScore} / {step.maxScore ?? 'N'}
              </span>
            ) : (
              <span>- / {step.maxScore ?? 'N'}</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowResult(true)}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
      </div>

      {showResult && (
        <TestResultModal
          step={step}
          examDetail={examDetail}
          testType={testType}
          includeSynonyms={includeSynonyms}
          onClose={() => setShowResult(false)}
        />
      )}
    </>
  );
}
