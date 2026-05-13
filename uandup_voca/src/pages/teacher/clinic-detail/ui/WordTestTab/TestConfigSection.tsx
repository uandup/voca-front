import { useState } from 'react';
import type { WordTestType } from '@/entities/test';
import { NumberInput } from '@/shared/ui/NumberInput';
import { useUpdateExamSettings } from '../../model/hooks/useUpdateExamSettings';

// StepPanel 상단의 시험 설정(타입/문항 수/동의어 포함) 편집 영역.
// 모든 phase에서 표시되며 'pending' phase에서만 Edit/Apply 버튼이 노출된다.
// 편집 중인 로컬 폼 상태와 updateExamSettings mutation을 자체 소유한다.

export interface ExamConfig {
  testQty: number;
  testType: WordTestType;
  includeSynonyms: boolean;
}

interface Props {
  studentId: number;
  initialConfig: ExamConfig;
  showEditButton: boolean;
  // 편집 모드 전환을 상위에 알린다 — Generate Test 같은 다른 액션을 잠그는 용도.
  onEditingChange?: (editing: boolean) => void;
}

const TEST_TYPE_OPTIONS: WordTestType[] = ['meaning-to-word', 'word-to-meaning'];

export function TestConfigSection({
  studentId,
  initialConfig,
  showEditButton,
  onEditingChange,
}: Props) {
  const [config, setConfig] = useState<ExamConfig>(initialConfig);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateSettings } = useUpdateExamSettings(studentId);

  function changeEditing(editing: boolean) {
    setIsEditing(editing);
    onEditingChange?.(editing);
  }

  function handleChange(patch: Partial<ExamConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleToggleEdit() {
    if (!isEditing) {
      changeEditing(true);
      return;
    }
    updateSettings(
      {
        examQuestionCount: config.testQty,
        examSubType: config.testType === 'word-to-meaning' ? 'WORD_TO_MEANING' : 'MEANING_TO_WORD',
        synonymIncluded: config.includeSynonyms,
      },
      { onSuccess: () => changeEditing(false) },
    );
  }

  function handleCancelEdit() {
    setConfig(initialConfig);
    changeEditing(false);
  }

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
              onChange={(e) => handleChange({ testType: e.target.value as WordTestType })}
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
              onChange={(v) => handleChange({ testQty: Number(v) })}
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
                onChange={(e) => handleChange({ includeSynonyms: e.target.checked })}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-8 h-5 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </div>

        <div className="shrink-0 flex gap-2">
          {showEditButton && isEditing && (
            <button
              onClick={handleCancelEdit}
              className="px-1.5 py-1.5 rounded-lg border border-outline/30 text-on-surface-variant hover:bg-slate-50 transition-colors flex items-center justify-center"
              aria-label="Cancel"
            >
              <span className="material-symbols-outlined leading-none" style={{ fontSize: '14px' }}>
                close
              </span>
            </button>
          )}
          {showEditButton && (
            <button
              onClick={handleToggleEdit}
              className="w-14.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Apply' : 'Edit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
