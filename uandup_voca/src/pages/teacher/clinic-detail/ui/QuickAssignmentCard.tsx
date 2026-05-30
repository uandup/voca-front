import { useMemo, useState } from 'react';
import { DIFFICULTY_LEVELS } from '@/entities/word';
import type { WordDifficultyLevel as DifficultyLevel } from '@/entities/word';
import type { StudySetRow } from '@/entities/student';
import { NumberInput } from '@/shared/ui/NumberInput';
import { useAssignmentActions } from '../model/useAssignmentActions';
import { useStudentOverview } from '@/entities/student';
import { AssignedWordsModal } from './WordTestTab/AssignedWordsModal';

interface Props {
  studentId: number;
  // 학생의 모든 cycle. "Already assigned" 상태에서 진행 중인 cycle의 studySetId를
  // 추출하기 위해 ClinicDetailPage가 이미 보유한 목록을 그대로 내려받는다 —
  // 별도 API 호출 없이 동일 캐시를 재사용한다.
  studySets: StudySetRow[];
}

const disabledCls =
  'disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed';

export function QuickAssignmentCard({ studentId, studySets }: Props) {
  // 학생 데이터의 single source of truth는 서버 캐시(useStudentOverview).
  // invalidate가 일어나면 즉시 새 값이 반영되도록 prop drilling 대신 직접 구독한다 —
  // 학생 수정 모달에서 변경한 배정 수/레벨이 캐시 갱신과 동시에 여기에 비치도록.
  const { data: student } = useStudentOverview(studentId);
  const { assign, updateSettings } = useAssignmentActions(studentId);

  // 편집 중에만 사용되는 임시 값. null이면 view 모드(서버 값 그대로 표시).
  const [draft, setDraft] = useState<{ level: DifficultyLevel; qty: number } | null>(null);
  const [showApplyWarning, setShowApplyWarning] = useState(false);
  const [isWordsModalOpen, setIsWordsModalOpen] = useState(false);

  // 진행 중인 NORMAL 배정 존재 여부는 서버가 진실의 원천 — assign 성공 시 invalidate로 자연 갱신.
  const isAssigned = student?.alreadyAssigned ?? false;

  // "Already assigned" 상태에서 보여줄 cycle = 가장 최근에 배정된 study-set.
  // 배정 후 생성된 cycle은 단어/예문 시험이 끝나기 전까지 재생성될 수 없으므로,
  // alreadyAssigned가 true일 때 최신 cycle이 곧 진행 중인 그 cycle이다.
  const activeStudySet = useMemo(
    () => [...studySets].sort((a, b) => b.assignedDate.localeCompare(a.assignedDate))[0] ?? null,
    [studySets],
  );

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
          {/* 진행 중인 cycle이 식별될 때만 활성화 — studySetId 없이는 단어 조회가 불가능하다. */}
          <button
            onClick={() => setIsWordsModalOpen(true)}
            disabled={!activeStudySet}
            className="mt-1 flex items-center gap-1 text-xs font-bold text-primary/70 hover:text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
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
                disabled={updateSettings.isPending || (isEditing && displayQty === 0)}
                className="w-16 py-3 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isEditing ? 'Apply' : 'Edit'}
              </button>
            </div>
          </div>

          {showApplyWarning && (
            <p className="text-xs py-2 text-error">Please apply your changes before assigning.</p>
          )}

          {/* qty가 0이면 편집/배정 모두 불가 — 이유를 표시해 사용자가 직접 수정할 수 있게 한다. */}
          {displayQty === 0 && (
            <p className="text-xs py-2 text-error">Qty must be at least 1 to assign.</p>
          )}

          <button
            onClick={handleAssign}
            disabled={assign.isPending || displayQty === 0}
            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity mt-auto pt-5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Assign New Words
          </button>
        </>
      )}

      {/* CycleRow의 "View Words"와 동일한 모달을 재사용 — 진행 중인 cycle의 단어 목록을 read-only로 노출. */}
      {isWordsModalOpen && activeStudySet && (
        <AssignedWordsModal
          studySetId={activeStudySet.studySetId}
          levels={activeStudySet.levels}
          wordCount={activeStudySet.wordCount}
          onClose={() => setIsWordsModalOpen(false)}
        />
      )}
    </div>
  );
}
