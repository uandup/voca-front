import StepCard from './StepCard';
import type { TestStep } from './types';

const MOCK_STEPS: TestStep[] = [
  {
    key: 'word',
    label: 'Word Test',
    status: 'done',
    date: '23.10.23',
    score: '98/100',
    isPassed: true,
  },
  {
    key: 'example',
    label: 'Example Test',
    status: 'done',
    date: '23.10.24',
    score: '92/100',
    isPassed: true,
  },
  {
    key: 'review1',
    label: 'Review 1',
    status: 'active',
    date: '23.10.24',
    subLabel: 'Unlocks in 4h',
  },
  {
    key: 'review2',
    label: 'Review 2',
    status: 'locked',
    subLabel: 'Locked until Step 3',
  },
  {
    key: 'review3',
    label: 'Review 3',
    status: 'locked',
    subLabel: 'Final Consolidation',
  },
];

export default function WordTestWorkflow() {
  return (
    <div className="bg-white border border-outline/20 rounded-2xl p-5 flex flex-col gap-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-on-surface">Cycle #48-97</h4>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
            High Priority ( 이 영역이 필요한가 ? )
          </span>
        </div>
        <span className="text-xs text-on-surface-variant">Started: 23.10.23</span>
      </div>

      {/* 스텝 카드 가로 나열 */}
      <div className="flex items-stretch gap-0">
        {MOCK_STEPS.map((step, idx) => (
          <StepCard key={step.key} step={step} isLast={idx === MOCK_STEPS.length - 1} />
        ))}
      </div>
    </div>
  );
}
