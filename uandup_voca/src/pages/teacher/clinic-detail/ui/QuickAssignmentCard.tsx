import { useState } from 'react';
import type { Word as Vocab } from '@/entities/word';

type DifficultyLevel = Vocab['difficultyLevel'];

interface Props {
  targetLevel: DifficultyLevel;
  qty: number;
  onTargetLevelChange: (v: DifficultyLevel) => void;
  onQtyChange: (v: number) => void;
  onAssign: () => void;
}

const disabledCls =
  'disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed';

export function QuickAssignmentCard({
  targetLevel,
  qty,
  onTargetLevelChange,
  onQtyChange,
  onAssign,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showApplyWarning, setShowApplyWarning] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);

  function handleAssign() {
    if (isEditing) {
      setShowApplyWarning(true);
      return;
    }
    setIsAssigned(true);
    onAssign();
  }

  function handleApply() {
    setIsEditing(false);
    setShowApplyWarning(false);
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
                onChange={(e) => onTargetLevelChange(Number(e.target.value) as DifficultyLevel)}
                disabled={!isEditing}
                className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${disabledCls}`}
              >
                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as DifficultyLevel[]).map((lv) => (
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
                onChange={(e) => onQtyChange(Number(e.target.value))}
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
            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity mt-auto pt-5"
          >
            Assign New Words
          </button>
        </>
      )}
    </div>
  );
}
