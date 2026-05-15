import { useState } from 'react';
import { DIFFICULTY_LEVELS } from '@/entities/word';
import type { WordDifficultyLevel as DifficultyLevel } from '@/entities/word';
import { NumberInput } from '@/shared/ui/NumberInput';
import { useAssignmentActions } from '../model/hooks/useAssignmentActions';
import { useStudentOverview } from '@/features/student';

interface Props {
  studentId: number;
}

const disabledCls =
  'disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed';

export function QuickAssignmentCard({ studentId }: Props) {
  // 학생 데이터의 single source of truth는 서버 캐시(useStudentOverview).
  // invalidate가 일어나면 즉시 새 값이 반영되도록 prop drilling 대신 직접 구독한다 —
  // 학생 수정 모달에서 변경한 배정 수/레벨이 캐시 갱신과 동시에 여기에 비치도록.
  const { data: student } = useStudentOverview(studentId);
  const { assign, updateSettings } = useAssignmentActions(studentId);

  // 편집 중에만 사용되는 임시 값. null이면 view 모드(서버 값 그대로 표시).
  const [draft, setDraft] = useState<{ level: DifficultyLevel; qty: number } | null>(null);
  const [showApplyWarning, setShowApplyWarning] = useState(false);

  // 진행 중인 NORMAL 배정 존재 여부는 서버가 진실의 원천 — assign 성공 시 invalidate로 자연 갱신.
  const isAssigned = student?.alreadyAssigned ?? false;

  const isEditing = draft !== null;
  // student가 잠깐 비어있는 첫 렌더에 대비한 fallback.
  const displayLevel = draft?.level ?? student?.assignedLevel ?? 1;
  const displayQty = draft?.qty ?? student?.assignmentCount ?? 0;

  function startEditing() {
    if (!student) return;
    setDraft({ level: student.assignedLevel, qty: student.assignmentCount });
  }

  function cancelEdit() {
    setDraft(null);
    setShowApplyWarning(false);
  }

  function applyEdit() {
    if (!draft) return;
    setShowApplyWarning(false);
    // 성공 시 draft를 비워 view 모드로 — 서버 값이 다시 진실의 원천이 된다.
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
    <div className="col-span-4 bg-white border border-outline/20 rounded-2xl p-7 flex flex-col">
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pb-3">
        Assignment
      </p>

      {/* 배정된 상태 오버레이 */}
      {isAssigned ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-1 bg-slate-50 border border-slate-200 rounded-xl py-6">
          <p className="text-md font-bold text-on-surface-variant">Already assigned</p>
          <button className="mt-1 flex items-center gap-1 text-xs font-bold text-primary/70 hover:text-primary cursor-pointer">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            View assigned words
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-3">
            {/* Target Level — 2/5 */}
            <div className="flex-2">
              <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 block">
                Level
              </label>
              <select
                value={displayLevel}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev ? { ...prev, level: Number(e.target.value) as DifficultyLevel } : prev,
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

            {/* Qty — 2/5 */}
            <div className="flex-2">
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

            {/* Edit / Apply (+ Cancel) 버튼 */}
            <div className="flex gap-1.5 shrink-0">
              {isEditing && (
                <button
                  onClick={cancelEdit}
                  className="px-3 py-3 rounded-lg border border-outline/30 text-on-surface-variant hover:bg-slate-50 transition-colors flex items-center justify-center"
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
                className="w-16 py-3 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isEditing ? 'Apply' : 'Edit'}
              </button>
            </div>
          </div>

          {showApplyWarning && (
            <p className="text-xs py-2 text-error">Please apply your changes before assigning.</p>
          )}

          <button
            onClick={handleAssign}
            disabled={assign.isPending}
            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity mt-auto pt-5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Assign New Words
          </button>
        </>
      )}
    </div>
  );
}
