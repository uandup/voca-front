import { Fragment, useState } from 'react';
import StepCard from './StepCard';
import StepPanel from './StepPanel';
import type { TestBundleRow, StepCardVM } from '@/entities/test';

export default function CycleRow({ id, assignedLevel, wordCount, steps }: TestBundleRow) {
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const selectedStep: StepCardVM | null = steps.find((s) => s.name === selectedName) ?? null;

  function handleStepClick(name: string) {
    setSelectedName((prev) => (prev === name ? null : name));
  }

  return (
    <div className="bg-white border border-outline/20 rounded-2xl px-5 py-4 flex flex-col gap-4">
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-on-surface-variant">Level</span>
            <span className="text-sm font-bold text-on-surface">{assignedLevel}</span>
          </div>
          <div className="w-px h-3.5 bg-outline/20" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-on-surface-variant">Words</span>
            <span className="text-sm font-bold text-on-surface">{wordCount}</span>
          </div>
          <a
            href={`/teacher/word-list/${id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline/30 text-xs font-semibold text-success hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              menu_book
            </span>
            View Words
          </a>
        </div>
      </div>

      <div className="flex items-stretch">
        {steps.map((step, idx) => (
          <Fragment key={step.name}>
            <StepCard
              step={step}
              isSelected={selectedName === step.name}
              onClick={() => handleStepClick(step.name)}
            />
            {idx < steps.length - 1 && (
              <div className="flex items-center shrink-0">
                <span className="material-symbols-outlined text-slate-300 text-base mx-1">
                  chevron_right
                </span>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {selectedStep && <StepPanel step={selectedStep} />}
    </div>
  );
}
