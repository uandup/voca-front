import { Fragment, useState } from 'react';
import StepCard from './StepCard';
import StepPanel from './StepPanel';
import type { TestStep } from '../types';

export interface CycleRowData {
  title: string;
  badge?: string;
  scheduledDate: string;
  steps: TestStep[];
}

export default function CycleRow({ title, badge, scheduledDate, steps }: CycleRowData) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const selectedStep = steps.find((s) => s.key === selectedKey) ?? null;

  function handleStepClick(key: string) {
    setSelectedKey((prev) => (prev === key ? null : key));
  }

  return (
    <div className="bg-white border border-outline/20 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-on-surface">{title}</h4>
          {badge && (
            <span className="text-[10px] font-bold text-on-surface-variant bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
        <span className="text-xs text-on-surface-variant">Scheduled: {scheduledDate}</span>
      </div>

      <div className="flex items-stretch">
        {steps.map((step, idx) => (
          <Fragment key={step.key}>
            <StepCard
              step={step}
              isSelected={selectedKey === step.key}
              onClick={() => handleStepClick(step.key)}
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
