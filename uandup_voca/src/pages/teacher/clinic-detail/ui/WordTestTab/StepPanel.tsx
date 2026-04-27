import { useState } from 'react';
import type { TestStep, TestType } from './types';
import { SuccessModal } from '@/shared/ui/SuccessModal';
import { NumberInput } from '@/shared/ui/NumberInput';
import {
  WordTestModal,
  SentenceModal,
  WordGradingModal,
  WordResultModal,
  SentenceGradingModal,
  SentenceResultModal,
} from '@/widgets/test-offline';
import { mockVocabList, mockESRows } from '@/entities/test/lib/mockData';

interface StepPanelProps {
  step: TestStep;
}

type PanelPhase = 'pending' | 'created' | 'fail' | 'passed';

interface TestConfig {
  testQty: number;
  testType: TestType;
  includeSynonyms: boolean;
}

function inferPhase(step: TestStep): PanelPhase {
  if (step.status === 'passed') return 'passed';
  if (step.status === 'fail') return 'fail';
  if (step.status === 'active') return 'created';
  return 'pending';
}

export default function StepPanel({ step }: StepPanelProps) {
  const phase = inferPhase(step);

  const [config, setConfig] = useState<TestConfig>({
    testQty: 30,
    testType: 'Meaning to Word',
    includeSynonyms: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  return (
    <>
      {showSuccessModal && (
        <SuccessModal
          message="Test Generated!"
          description="The test has been successfully created."
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showPrintModal && step.key === 'sentence' ? (
        <SentenceModal onClose={() => setShowPrintModal(false)} rows={mockESRows} />
      ) : (
        showPrintModal && (
          <WordTestModal
            onClose={() => setShowPrintModal(false)}
            rows={mockVocabList}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
          />
        )
      )}

      {showGradingModal && step.key === 'sentence' ? (
        <SentenceGradingModal
          onClose={() => setShowGradingModal(false)}
          onGrade={() => console.warn('Grade submitted')}
          rows={mockESRows}
        />
      ) : (
        showGradingModal && (
          <WordGradingModal
            onClose={() => setShowGradingModal(false)}
            onGrade={() => console.warn('Grade submitted')}
            rows={mockVocabList}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
          />
        )
      )}

      {showResultModal && step.key === 'sentence' ? (
        <SentenceResultModal
          onClose={() => setShowResultModal(false)}
          rows={mockESRows}
          wrongIndices={[1, 4, 7]}
        />
      ) : (
        showResultModal && (
          <WordResultModal
            onClose={() => setShowResultModal(false)}
            rows={mockVocabList}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
            wrongIndices={[1, 4, 7]}
          />
        )
      )}

      <div className="bg-slate-50 border border-outline/20 rounded-2xl p-5 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
        <TestConfigSection
          config={config}
          isEditing={isEditing}
          showEditButton={phase === 'pending'}
          onToggleEdit={() => setIsEditing((v) => !v)}
          onChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
        />

        {phase === 'pending' && (
          <PendingPanel isEditing={isEditing} onGenerate={() => setShowSuccessModal(true)} />
        )}
        {phase === 'created' && (
          <CreatedPanel
            step={step}
            onOpenPrint={() => setShowPrintModal(true)}
            onGradeOnline={() => console.warn('Online grading')}
            onGradeOffline={() => setShowGradingModal(true)}
          />
        )}
        {phase === 'fail' && (
          <FailPanel
            step={step}
            onOpenGrading={() => setShowGradingModal(true)}
            onOpenResult={() => setShowResultModal(true)}
          />
        )}
        {phase === 'passed' && (
          <PassedPanel step={step} onOpenResult={() => setShowResultModal(true)} />
        )}
      </div>
    </>
  );
}

// ── TestConfigSection ──────────────────────────────────────────────────────

interface TestConfigSectionProps {
  config: TestConfig;
  isEditing: boolean;
  showEditButton: boolean;
  onToggleEdit: () => void;
  onChange: (patch: Partial<TestConfig>) => void;
}

const TEST_TYPE_OPTIONS: TestType[] = ['Meaning to Word', 'Word to Meaning'];

function TestConfigSection({
  config,
  isEditing,
  showEditButton,
  onToggleEdit,
  onChange,
}: TestConfigSectionProps) {
  const inputClass = `w-full text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed transition-colors ${
    isEditing
      ? 'border-primary/30 bg-white text-on-surface'
      : 'border-slate-200 bg-slate-100 text-slate-500'
  }`;

  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-gray-200">
      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
        Test Configuration
      </p>

      <div className="flex items-end gap-3">
        <div className="grid grid-cols-3 gap-4 flex-1">
          <div>
            <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
              Test Type
            </label>
            <select
              value={config.testType}
              onChange={(e) => onChange({ testType: e.target.value as TestType })}
              disabled={!isEditing}
              className={inputClass}
            >
              {TEST_TYPE_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
              Quantity
            </label>
            <NumberInput
              value={String(config.testQty)}
              onChange={(v) => onChange({ testQty: Number(v) })}
              min={1}
              disabled={!isEditing}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
              Include Synonyms
            </label>
            <label
              className={`relative inline-flex items-center mt-1 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            >
              <input
                type="checkbox"
                checked={config.includeSynonyms}
                onChange={(e) => onChange({ includeSynonyms: e.target.checked })}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-8 h-5 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </div>

        <div className="w-14.5 shrink-0">
          {showEditButton && (
            <button
              onClick={onToggleEdit}
              className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Apply' : 'Edit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Phase panels ───────────────────────────────────────────────────────────

function PendingPanel({ isEditing, onGenerate }: { isEditing: boolean; onGenerate: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isEditing}
        onClick={onGenerate}
        className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Generate Test
      </button>
      {isEditing && (
        <p className="text-xs text-error">Please apply the configuration before generating.</p>
      )}
    </div>
  );
}

function CreatedPanel({
  step,
  onOpenPrint,
  onGradeOnline,
  onGradeOffline,
}: {
  step: TestStep;
  onOpenPrint: () => void;
  onGradeOnline: () => void;
  onGradeOffline: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.date && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.date}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span>
            Score : {step.scores?.[0] ?? '-'} / {step.totalScore ?? 'N'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20">
            Start Online Test
          </button>
          <button
            onClick={onOpenPrint}
            className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            Preview
          </button>
          <button
            onClick={onOpenPrint}
            className="p-2 rounded-xl border border-outline/30 text-on-surface-variant hover:bg-slate-100 transition-colors flex items-center"
            title="Print"
          >
            <span className="material-symbols-outlined leading-none" style={{ fontSize: '18px' }}>
              print
            </span>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onGradeOnline}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade Online
          </button>
          <button
            onClick={onGradeOffline}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade Offline
          </button>
          <button className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors">
            Cancel Test
          </button>
        </div>
      </div>
    </>
  );
}

function FailPanel({
  step,
  onOpenGrading,
  onOpenResult,
}: {
  step: TestStep;
  onOpenGrading: () => void;
  onOpenResult: () => void;
}) {
  const [failState, setFailState] = useState<'fail' | 'awaiting'>(step.failState ?? 'fail');
  const scores = step.scores ?? [];

  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.date && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.date}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span className="flex items-center gap-1.5">
            Score :{' '}
            {scores.length > 0 ? (
              scores.map((score, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-on-surface-variant">→</span>}
                  <span className="text-error font-semibold">
                    {score} / {step.totalScore ?? 'N'}
                  </span>
                </span>
              ))
            ) : (
              <span className="text-error font-semibold">- / {step.totalScore ?? 'N'}</span>
            )}
            {failState === 'awaiting' && (
              <>
                <span className="text-on-surface-variant">→</span>
                <span className="text-on-surface-variant font-semibold">
                  - / {step.totalScore ?? 'N'}
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* DEV ONLY */}
      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
        {(['fail', 'awaiting'] as const).map((s) => (
          <label key={s} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={failState === s}
              onChange={() => setFailState(s)}
              className="accent-primary"
            />
            {s}
          </label>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={failState === 'awaiting'}
          className="px-4 py-2 rounded-xl bg-error text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-error/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {failState === 'awaiting' ? 'Awaiting Grading' : 'Retake Test'}
        </button>
        <button
          onClick={onOpenResult}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
        {failState === 'awaiting' && (
          <div className="ml-auto">
            <button
              onClick={onOpenGrading}
              className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
            >
              Grade
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function PassedPanel({ step, onOpenResult }: { step: TestStep; onOpenResult: () => void }) {
  const scores = step.scores ?? [];

  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.date && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.date}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span className="flex items-center gap-1.5">
            Score :{' '}
            {scores.map((score, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-on-surface-variant">→</span>}
                <span
                  className={`font-semibold ${i === scores.length - 1 ? 'text-success' : 'text-error'}`}
                >
                  {score} / {step.totalScore ?? 'N'}
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenResult}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
      </div>
    </>
  );
}
