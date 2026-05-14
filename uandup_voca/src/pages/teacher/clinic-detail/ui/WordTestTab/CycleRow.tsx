import { Fragment, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import StepCard from './StepCard';
import StepPanel from './StepPanel';
import { AssignedWordsModal } from './AssignedWordsModal';
import type { TestBundleRow, StepCardVM, StudySetExamType } from '@/entities/test';

const STEP_EXAM_TYPES: StudySetExamType[] = ['WORD', 'EXAMPLE', 'REVIEW1', 'REVIEW2', 'REVIEW3'];

interface Props extends TestBundleRow {
  studySetId: number;
  studentId: number;
}

export default function CycleRow({
  assignedLevel,
  wordCount,
  steps,
  studySetId,
  studentId,
}: Props) {
  // URL의 openSet/openStep을 단일 진실로 사용한다.
  // Preview/Grade Online 페이지 이동 후 돌아와도 같은 step이 다시 열리도록 한다.
  const search = useSearch({ from: '/teacher/clinics_/students/$studentId' });
  const navigate = useNavigate();
  const selectedName = search.openSet === studySetId ? (search.openStep ?? null) : null;

  const [isWordsModalOpen, setIsWordsModalOpen] = useState(false);

  const selectedIdx = steps.findIndex((s) => s.name === selectedName);
  const selectedStep: StepCardVM | null = selectedIdx !== -1 ? steps[selectedIdx] : null;
  const selectedExamType: StudySetExamType | null =
    selectedIdx !== -1 ? STEP_EXAM_TYPES[selectedIdx] : null;

  function handleStepClick(name: string) {
    const next = selectedName === name ? null : name;
    navigate({
      to: '.',
      search: {
        openSet: next ? studySetId : undefined,
        openStep: next ?? undefined,
      },
      replace: true,
    });
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
          <button
            onClick={() => setIsWordsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline/30 text-xs font-semibold text-success hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              menu_book
            </span>
            View Words
          </button>
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

      {selectedStep && selectedExamType && (
        <StepPanel
          step={selectedStep}
          studySetId={studySetId}
          studentId={studentId}
          examType={selectedExamType}
        />
      )}

      {isWordsModalOpen && (
        <AssignedWordsModal
          studySetId={studySetId}
          level={assignedLevel}
          wordCount={wordCount}
          onClose={() => setIsWordsModalOpen(false)}
        />
      )}
    </div>
  );
}
