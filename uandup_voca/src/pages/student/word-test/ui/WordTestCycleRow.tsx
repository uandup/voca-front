import { Fragment } from 'react';
import { useNavigate } from '@tanstack/react-router';
import WordTestStepCard from './WordTestStepCard';
import type { TestBundleRow, StepCardVM, StudySetExamType } from '@/entities/test';

// step.name 순서와 1:1 매핑되는 examType. toTestBundleRow가 step을 항상 이 순서로 생성하므로 안전.
const STEP_EXAM_TYPES: StudySetExamType[] = ['WORD', 'EXAMPLE', 'REVIEW1', 'REVIEW2', 'REVIEW3'];

export default function WordTestCycleRow({ id, levels, wordCount, steps }: TestBundleRow) {
  const navigate = useNavigate();

  function returnToCurrent() {
    return window.location.pathname + window.location.search;
  }

  function handleStepAction(step: StepCardVM, idx: number) {
    if (step.examId === null) return;
    const examType = STEP_EXAM_TYPES[idx];
    navigate({
      to: '/student/exams/$examId/take',
      params: { examId: String(step.examId) },
      search: { returnTo: returnToCurrent(), examType },
    });
  }

  return (
    <div className="bg-white border border-outline/20 rounded-2xl px-5 py-4 flex flex-col gap-4">
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-on-surface-variant">Words</span>
            <span className="text-sm font-bold text-on-surface">{wordCount}</span>
          </div>
          (
          {/* 한 study-set이 레벨 경계를 넘어 배정된 경우 levels.length > 1 — 각 레벨별 단어 수를
              "Level{N} · {count} | Level{N+1} · {count}" 형태로 인라인 노출하고
              "Level Up" 배지로 시각화한다. (teacher CycleRow와 동일 패턴) */}
          <div className="flex items-center gap-1.5">
            {levels.length === 0 ? (
              <>
                <span className="text-xs text-on-surface-variant">Level</span>
                <span className="text-xs font-medium text-on-surface">-</span>
              </>
            ) : (
              <span className="text-xs font-medium text-on-surface flex items-center gap-1.5">
                {levels.map((lc, i) => (
                  <Fragment key={lc.level}>
                    {i > 0 && <span className="text-on-surface-variant/40">|</span>}
                    <span>
                      Level {lc.level}
                      <span className="text-on-surface-variant font-medium ml-1">· {lc.count}</span>
                    </span>
                  </Fragment>
                ))}
              </span>
            )}
            {levels.length > 1 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-success/10 text-[10px] font-bold text-success uppercase tracking-wider">
                Level Up
              </span>
            )}
            )
          </div>
          <button
            onClick={() => navigate({ to: '/student/word-test/$id/words', params: { id } })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline/30 text-xs font-semibold text-success hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              menu_book
            </span>
            View Words
          </button>
        </div>
      </div>

      <div className="flex items-stretch gap-0">
        {steps.map((step, idx) => {
          // pending(선생님 시작 대기)은 카드 본체는 활성으로 두되 "Pending Release" 버튼만 비활성.
          // locked/grading은 카드 자체를 흐리게 처리.
          const isInactive = step.status === 'locked'; // || step.status === 'grading';
          return (
            <Fragment key={step.name}>
              <div className="relative flex-1 min-w-0 h-44">
                <WordTestStepCard step={step} onAction={() => handleStepAction(step, idx)} />
                {isInactive && <div className="absolute inset-0 rounded-2xl bg-white/60" />}
              </div>
              {idx < steps.length - 1 && (
                <div className="flex items-center shrink-0">
                  <span className="material-symbols-outlined text-slate-300 text-base mx-1">
                    chevron_right
                  </span>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
