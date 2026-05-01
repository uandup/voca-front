import { Fragment } from 'react';
import { useNavigate } from '@tanstack/react-router';
import StepCard from './StepCard';
import type { TestStep } from '@/entities/test';

export interface CycleRowData {
  id: string;
  level: number;
  wordCount: number;
  steps: TestStep[];
}

export default function CycleRow({ id, level, wordCount, steps }: CycleRowData) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-outline/20 rounded-2xl px-5 py-4 flex flex-col gap-4">
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-on-surface-variant">Level</span>
            <span className="text-sm font-bold text-on-surface">{level}</span>
          </div>
          <div className="w-px h-3.5 bg-outline/20" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-on-surface-variant">Words</span>
            <span className="text-sm font-bold text-on-surface">{wordCount}</span>
          </div>
          <button
            onClick={() => navigate({ to: '/student/word-test/$id/vocabulary', params: { id } })}
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
          const isInactive =
            step.status === 'locked' || step.status === 'waiting' || step.status === 'grading';
          return (
            <Fragment key={step.key}>
              <div className="relative flex-1 min-w-0 h-44">
                <StepCard step={step} />
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
