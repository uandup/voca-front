import { useState } from "react";
import { ModalBackdrop } from "@/shared/ui/ModalBackdrop";
import type { ManagedStudent } from "../../mock/studentManageMockData";

interface EditStudentModalProps {
  student: ManagedStudent;
  onClose: () => void;
  onSave: (updated: ManagedStudent) => void;
}

const ALL_LEVELS = [1, 2, 3, 4] as const;

export function EditStudentModal({
  student,
  onClose,
  onSave,
}: EditStudentModalProps) {
  const [nameKo, setNameKo] = useState(student.nameKo);
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade);
  const [levels, setLevels] = useState<(1 | 2 | 3 | 4)[]>(
    student.assignedLevels,
  );
  const [wordCount, setWordCount] = useState(String(student.assignedWordCount));
  const [memo, setMemo] = useState(student.memo ?? "");

  function toggleLevel(level: (typeof ALL_LEVELS)[number]) {
    if (levels.includes(level)) {
      if (levels.length === 1) return;
      setLevels((prev) => prev.filter((l) => l !== level));
    } else {
      setLevels((prev) => [...prev, level].sort((a, b) => a - b));
    }
  }

  function handleSave() {
    onSave({
      ...student,
      nameKo,
      name,
      grade,
      assignedLevels: levels,
      assignedWordCount: Number(wordCount),
      memo: memo || undefined,
    });
    onClose();
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-extrabold font-headline tracking-tight text-primary">
              Edit Student
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col gap-6">
          {/* 이름 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Name (Korean)
              </label>
              <input
                className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={nameKo}
                onChange={(e) => setNameKo(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Name (English)
              </label>
              <input
                className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* 학년 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Grade
            </label>
            <div className="relative">
              <select
                className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
              >
                {[12, 11, 10, 9, 8, 7, 6, 5, 4].map((g) => (
                  <option key={g} value={g}>
                    G{g}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* 배정 난이도 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Difficulty Level
            </label>
            <div className="flex gap-2">
              {ALL_LEVELS.map((level) => {
                const active = levels.includes(level);
                return (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`w-12 h-10 rounded-xl text-sm font-bold border transition-all ${
                      active
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/50"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 배정 단어 개수 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Word Count
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                className="w-28 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          {/* 메모 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Memo
            </label>
            <textarea
              className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              rows={4}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-outline-variant/30 flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md active:scale-95 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
