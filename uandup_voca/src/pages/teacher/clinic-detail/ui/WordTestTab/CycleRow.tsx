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

export default function CycleRow({ levels, wordCount, steps, studySetId, studentId }: Props) {
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
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-on-surface-variant">Words</span>
            <span className="text-sm font-bold text-on-surface">{wordCount}</span>
          </div>
          (
          {/* 한 study-set이 레벨 경계를 넘어 배정된 경우 levels.length > 1 — 각 레벨별 단어 수를
              "Level{N} · {count} | Level{N+1} · {count}" 형태로 인라인 노출하고
              "Level Up" 배지로 시각화한다. */}
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
          levels={levels}
          wordCount={wordCount}
          onClose={() => setIsWordsModalOpen(false)}
        />
      )}
    </div>
  );
}
