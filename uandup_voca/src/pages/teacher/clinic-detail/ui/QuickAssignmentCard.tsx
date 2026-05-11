import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DIFFICULTY_LEVELS } from '@/entities/word';
import type { WordDifficultyLevel as DifficultyLevel } from '@/entities/word';
import { assignWords, updateAssignmentCount } from '@/entities/student';

interface Props {
  studentId: number;
  initialLevel: DifficultyLevel;
  initialQty: number;
}

const disabledCls =
  'disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed';

export function QuickAssignmentCard({ studentId, initialLevel, initialQty }: Props) {
  const queryClient = useQueryClient();

  const [targetLevel, setTargetLevel] = useState<DifficultyLevel>(initialLevel);
  const [qty, setQty] = useState<number>(initialQty);
  const [isEditing, setIsEditing] = useState(false);
  const [showApplyWarning, setShowApplyWarning] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);

  const assignMutation = useMutation({
    mutationFn: () => assignWords(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-detail', studentId, 'study-sets'] });
      setIsAssigned(true);
    },
  });

  const updateCountMutation = useMutation({
    mutationFn: (count: number) => updateAssignmentCount(studentId, { assignmentCount: count }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-detail', studentId, 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
  });

  function handleAssign() {
    if (isEditing) {
      setShowApplyWarning(true);
      return;
    }
    assignMutation.mutate();
  }

  function handleApply() {
    setIsEditing(false);
    setShowApplyWarning(false);
    updateCountMutation.mutate(qty);
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
          <p className="text-xs text-on-surface-variant/60 font-medium">
            Level {targetLevel} · {qty} words
          </p>
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
                value={targetLevel}
                onChange={(e) => setTargetLevel(Number(e.target.value) as DifficultyLevel)}
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
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={!isEditing}
                className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${disabledCls}`}
              />
            </div>

            {/* Edit / Apply 버튼 — 1/5 */}
            <div className="flex-1">
              <button
                onClick={isEditing ? handleApply : () => setIsEditing(true)}
                className="w-full py-3 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity"
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
            disabled={assignMutation.isPending}
            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity mt-auto pt-5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {assignMutation.isPending ? 'Assigning...' : 'Assign New Words'}
          </button>
        </>
      )}
    </div>
  );
}
