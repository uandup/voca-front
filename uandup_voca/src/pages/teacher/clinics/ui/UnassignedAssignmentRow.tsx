import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  assignWords,
  updateAssignmentCount,
  invalidateStudentCascade,
} from '@/entities/student';
import type { UnassignedStudentRow } from '@/entities/student';
import { DIFFICULTY_LEVELS } from '@/entities/word';
import type { WordDifficultyLevel } from '@/entities/word';
import { NumberInput } from '@/shared/ui/NumberInput';

interface Props {
  student: UnassignedStudentRow;
  isExpanded: boolean;
  onToggle: () => void;
}

const disabledCls =
  'disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed';

export function UnassignedAssignmentRow({ student, isExpanded, onToggle }: Props) {
  const queryClient = useQueryClient();

  const updateSettings = useMutation({
    mutationFn: (body: { assignmentCount: number; level: WordDifficultyLevel }) =>
      updateAssignmentCount(student.id, body),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });
  const assign = useMutation({
    mutationFn: () => assignWords(student.id),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });

  // 편집 중에만 쓰는 임시 값. null이면 view 모드.
  // 미배정 학생은 시작 레벨에 대한 서버 값이 없어 1을 기본으로 둔다.
  const [draft, setDraft] = useState<{ level: WordDifficultyLevel; qty: number } | null>(null);
  const [showApplyWarning, setShowApplyWarning] = useState(false);

  const isEditing = draft !== null;
  const displayLevel = draft?.level ?? 1;
  const displayQty = draft?.qty ?? student.assignmentCount;

  function startEditing() {
    setDraft({ level: 1, qty: student.assignmentCount });
  }

  function cancelEdit() {
    setDraft(null);
    setShowApplyWarning(false);
  }

  function applyEdit() {
    if (!draft) return;
    setShowApplyWarning(false);
    updateSettings.mutate(
      { assignmentCount: draft.qty, level: draft.level },
      { onSuccess: () => setDraft(null) },
    );
  }

  function handleAssign() {
    if (isEditing) {
      setShowApplyWarning(true);
      return;
    }
    assign.mutate();
  }

  return (
    <div>
      {/* 행 */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-7 py-4 text-left hover:bg-surface-container-low/50 transition-colors"
      >
        <div>
          <p className="font-headline font-bold text-sm text-on-surface">
            {student.nameKo}
            <span className="text-xs font-medium text-on-surface-variant ml-1.5">
              ( {student.englishName} · G{student.grade} )
            </span>
          </p>
          {student.clinics.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {student.clinics.map((c) => (
                <span
                  key={c}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-on-surface-variant/40 mt-1">No clinic</p>
          )}
        </div>
        <span
          className={`material-symbols-outlined text-on-surface-variant/40 transition-transform duration-200 shrink-0 ml-4 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* 인라인 배정 폼 */}
      {isExpanded && (
        <div className="px-7 pb-5 bg-surface-container-low/30">
          <div className="bg-white rounded-xl border border-primary/10 p-4 flex flex-col gap-3">
            <div className="flex items-end gap-3">
              {/* Level */}
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 block">
                  Level
                </label>
                <select
                  value={displayLevel}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev
                        ? { ...prev, level: Number(e.target.value) as WordDifficultyLevel }
                        : prev,
                    )
                  }
                  disabled={!isEditing}
                  className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${disabledCls}`}
                >
                  {DIFFICULTY_LEVELS.map((lv) => (
                    <option key={lv} value={lv}>
                      Level {lv}
                    </option>
                  ))}
                </select>
              </div>

              {/* Qty */}
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 block">
                  Qty
                </label>
                <NumberInput
                  value={String(displayQty)}
                  onChange={(v) => setDraft((prev) => (prev ? { ...prev, qty: Number(v) } : prev))}
                  disabled={!isEditing}
                  className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${disabledCls}`}
                />
              </div>

              {/* Edit / Apply (+ Cancel) */}
              <div className="flex gap-1.5 shrink-0">
                {isEditing && (
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-2.5 rounded-lg border border-outline/30 text-on-surface-variant hover:bg-slate-50 transition-colors flex items-center justify-center"
                    aria-label="Cancel"
                  >
                    <span
                      className="material-symbols-outlined leading-none"
                      style={{ fontSize: '14px' }}
                    >
                      close
                    </span>
                  </button>
                )}
                <button
                  onClick={isEditing ? applyEdit : startEditing}
                  disabled={updateSettings.isPending}
                  className="w-16 py-2.5 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isEditing ? 'Apply' : 'Edit'}
                </button>
              </div>
            </div>

            {showApplyWarning && (
              <p className="text-xs text-error">Please apply your changes before assigning.</p>
            )}

            <button
              onClick={handleAssign}
              disabled={assign.isPending}
              className="w-full flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Assign New Words
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
