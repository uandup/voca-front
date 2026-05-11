import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { StepCardVM, TestType, ExamType, ExamItem } from '@/entities/test';
import type { WordTestItem, VocabReviewItem } from '@/entities/word';
import type { ESRow } from '@/widgets/test-offline';
import {
  createExam,
  startOnlineExam,
  cancelExam,
  recordOnlineResults,
  recordOfflineResults,
} from '@/entities/test';
import { updateExamSettings } from '@/entities/student';
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
import { useStudySetDetail } from '../../model/hooks/useStudySetDetail';
import { useExamDetail } from '../../model/hooks/useExamDetail';

interface StepPanelProps {
  step: StepCardVM;
  studySetId: number;
  studentId: number;
  examType: ExamType;
}

type PanelPhase = 'pending' | 'created' | 'fail' | 'passed';

interface LocalTestConfig {
  testQty: number;
  testType: TestType;
  includeSynonyms: boolean;
}

function inferPhase(step: StepCardVM): PanelPhase {
  if (step.status === 'passed') return 'passed';
  if (step.status === 'fail') return 'fail';
  if (step.status === 'active' || step.status === 'grading') return 'created';
  return 'pending';
}

function toWordTestItems(items: ExamItem[]): WordTestItem[] {
  return items.map((item) => ({
    id: item.examItemId,
    word: item.word,
    korMeaning: item.koreanMeaning,
    engMeaning: item.englishMeaning,
  }));
}

function toVocabReviewItems(items: ExamItem[]): VocabReviewItem[] {
  return items.map((item) => ({
    id: item.examItemId,
    word: item.word,
    korMeaning: item.koreanMeaning,
    engMeaning: item.englishMeaning,
    synonymAnswer: item.synonyms[0] ?? '',
  }));
}

function toESRows(items: ExamItem[]): ESRow[] {
  return items.map((item, i) => ({
    no: String(i + 1),
    sentence: item.example,
    answer: item.koreanMeaning,
  }));
}

export default function StepPanel({ step, studySetId, studentId, examType }: StepPanelProps) {
  const phase = inferPhase(step);
  const queryClient = useQueryClient();

  const { data: examHistory } = useStudySetDetail(studySetId, examType, true);
  const currentExamId = examHistory?.currentExamId ?? null;

  const [modalExamId, setModalExamId] = useState<number | null>(null);
  const { data: examDetail } = useExamDetail(modalExamId);

  const [config, setConfig] = useState<LocalTestConfig>({
    testQty: 30,
    testType: 'meaning-to-word',
    includeSynonyms: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const invalidateSets = () =>
    queryClient.invalidateQueries({ queryKey: ['clinic-detail', studentId, 'study-sets'] });

  const createMutation = useMutation({
    mutationFn: () => createExam(studySetId, { examType }),
    onSuccess: () => {
      setShowSuccessModal(true);
      invalidateSets();
    },
  });

  const startOnlineMutation = useMutation({
    mutationFn: () => startOnlineExam(currentExamId!),
    onSuccess: invalidateSets,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelExam(currentExamId!),
    onSuccess: invalidateSets,
  });

  const gradeOnlineMutation = useMutation({
    mutationFn: (payload: Parameters<typeof recordOnlineResults>[1]) =>
      recordOnlineResults(currentExamId!, payload),
    onSuccess: () => {
      setShowGradingModal(false);
      invalidateSets();
    },
  });

  const gradeOfflineMutation = useMutation({
    mutationFn: (payload: Parameters<typeof recordOfflineResults>[1]) =>
      recordOfflineResults(currentExamId!, payload),
    onSuccess: () => {
      setShowGradingModal(false);
      invalidateSets();
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: () =>
      updateExamSettings(studentId, {
        examQuestionCount: config.testQty,
        examSubType: config.testType === 'word-to-meaning' ? 'WORD_TO_MEANING' : 'MEANING_TO_WORD',
        synonymIncluded: config.includeSynonyms,
      }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['clinic-detail', studentId, 'overview'] });
    },
  });

  const wordTestRows = examDetail ? toWordTestItems(examDetail.items) : [];
  const vocabReviewRows = examDetail ? toVocabReviewItems(examDetail.items) : [];
  const esRows = examDetail ? toESRows(examDetail.items) : [];
  const wrongIndices = examDetail
    ? examDetail.items.map((item, i) => (item.isCorrect === false ? i : -1)).filter((i) => i !== -1)
    : [];

  function handleOpenModal(type: 'print' | 'grading' | 'result') {
    setModalExamId(currentExamId);
    if (type === 'print') setShowPrintModal(true);
    if (type === 'grading') setShowGradingModal(true);
    if (type === 'result') setShowResultModal(true);
  }

  return (
    <>
      {showSuccessModal && (
        <SuccessModal
          message="Test Generated!"
          description="The test has been successfully created."
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showPrintModal && step.name === 'Sentence' ? (
        <SentenceModal onClose={() => setShowPrintModal(false)} rows={esRows} />
      ) : (
        showPrintModal && (
          <WordTestModal
            onClose={() => setShowPrintModal(false)}
            rows={wordTestRows}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
          />
        )
      )}

      {showGradingModal && step.name === 'Sentence' ? (
        <SentenceGradingModal
          onClose={() => setShowGradingModal(false)}
          onGrade={() => gradeOnlineMutation.mutate({ results: [], isPassed: false })}
          rows={esRows}
        />
      ) : (
        showGradingModal && (
          <WordGradingModal
            onClose={() => setShowGradingModal(false)}
            onGrade={() => gradeOfflineMutation.mutate({ results: [], isPassed: false })}
            rows={vocabReviewRows}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
          />
        )
      )}

      {showResultModal && step.name === 'Sentence' ? (
        <SentenceResultModal
          onClose={() => setShowResultModal(false)}
          rows={esRows}
          wrongIndices={wrongIndices}
        />
      ) : (
        showResultModal && (
          <WordResultModal
            onClose={() => setShowResultModal(false)}
            rows={vocabReviewRows}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
            wrongIndices={wrongIndices}
          />
        )
      )}

      <div className="bg-slate-50 border border-outline/20 rounded-2xl p-5 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
        <TestConfigSection
          config={config}
          isEditing={isEditing}
          showEditButton={phase === 'pending'}
          onToggleEdit={() => {
            if (isEditing) {
              updateSettingsMutation.mutate();
            } else {
              setIsEditing(true);
            }
          }}
          onChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
        />

        {phase === 'pending' && (
          <PendingPanel
            isEditing={isEditing}
            isPending={createMutation.isPending}
            onGenerate={() => createMutation.mutate()}
          />
        )}
        {phase === 'created' && (
          <CreatedPanel
            step={step}
            isStartPending={startOnlineMutation.isPending}
            isCancelPending={cancelMutation.isPending}
            onOpenPrint={() => handleOpenModal('print')}
            onGradeOnline={() => handleOpenModal('grading')}
            onGradeOffline={() => handleOpenModal('grading')}
            onStartOnline={() => startOnlineMutation.mutate()}
            onCancel={() => cancelMutation.mutate()}
          />
        )}
        {phase === 'fail' && (
          <FailPanel
            step={step}
            isRetakePending={createMutation.isPending}
            onRetake={() => createMutation.mutate()}
            onOpenGrading={() => handleOpenModal('grading')}
            onOpenResult={() => handleOpenModal('result')}
          />
        )}
        {phase === 'passed' && (
          <PassedPanel step={step} onOpenResult={() => handleOpenModal('result')} />
        )}
      </div>
    </>
  );
}

// ── TestConfigSection ──────────────────────────────────────────────────────

interface TestConfigSectionProps {
  config: LocalTestConfig;
  isEditing: boolean;
  showEditButton: boolean;
  onToggleEdit: () => void;
  onChange: (patch: Partial<LocalTestConfig>) => void;
}

const TEST_TYPE_OPTIONS: TestType[] = ['meaning-to-word', 'word-to-meaning'];

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

function PendingPanel({
  isEditing,
  isPending,
  onGenerate,
}: {
  isEditing: boolean;
  isPending: boolean;
  onGenerate: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isEditing || isPending}
        onClick={onGenerate}
        className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? 'Generating...' : 'Generate Test'}
      </button>
      {isEditing && (
        <p className="text-xs text-error">Please apply the configuration before generating.</p>
      )}
    </div>
  );
}

function CreatedPanel({
  step,
  isStartPending,
  isCancelPending,
  onOpenPrint,
  onGradeOnline,
  onGradeOffline,
  onStartOnline,
  onCancel,
}: {
  step: StepCardVM;
  isStartPending: boolean;
  isCancelPending: boolean;
  onOpenPrint: () => void;
  onGradeOnline: () => void;
  onGradeOffline: () => void;
  onStartOnline: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.gradedAt && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.gradedAt}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span>
            Score : {step.lastScore ?? '-'} / {step.maxScore ?? 'N'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onStartOnline}
            disabled={isStartPending}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 disabled:opacity-60"
          >
            {isStartPending ? 'Starting...' : 'Start Online Test'}
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
          <button
            onClick={onCancel}
            disabled={isCancelPending}
            className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-60"
          >
            {isCancelPending ? 'Cancelling...' : 'Cancel Test'}
          </button>
        </div>
      </div>
    </>
  );
}

function FailPanel({
  step,
  isRetakePending,
  onRetake,
  onOpenGrading,
  onOpenResult,
}: {
  step: StepCardVM;
  isRetakePending: boolean;
  onRetake: () => void;
  onOpenGrading: () => void;
  onOpenResult: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.gradedAt && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.gradedAt}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span className="flex items-center gap-1.5">
            Score :{' '}
            {step.lastScore !== null ? (
              <span className="text-error font-semibold">
                {step.lastScore} / {step.maxScore ?? 'N'}
              </span>
            ) : (
              <span className="text-error font-semibold">- / {step.maxScore ?? 'N'}</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRetake}
          disabled={isRetakePending}
          className="px-4 py-2 rounded-xl bg-error text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-error/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRetakePending ? 'Creating...' : 'Retake Test'}
        </button>
        <button
          onClick={onOpenResult}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
        <div className="ml-auto">
          <button
            onClick={onOpenGrading}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade
          </button>
        </div>
      </div>
    </>
  );
}

function PassedPanel({ step, onOpenResult }: { step: StepCardVM; onOpenResult: () => void }) {
  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.gradedAt && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.gradedAt}</span>
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
          onClick={onOpenResult}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
      </div>
    </>
  );
}
