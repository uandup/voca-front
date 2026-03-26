import { useState } from "react";

export interface StudentFormData {
  name: string;
  grade: number;
  difficultyLevel: number;
  wordCount: number;
}

interface EditStudentModalProps {
  student: StudentFormData;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
}

export function EditStudentModal({
  student,
  onClose,
  onSave,
}: EditStudentModalProps) {
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade);
  const [difficultyLevel, setDifficultyLevel] = useState(
    student.difficultyLevel,
  );
  const [wordCount, setWordCount] = useState(student.wordCount);

  function handleSave() {
    onSave({ name, grade, difficultyLevel, wordCount });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/20 flex items-center justify-between">
          <h3 className="text-xl font-bold text-primary font-headline">
            Edit Student Information
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant/60 hover:text-on-surface-variant transition-colors p-1 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Student Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label block">
              Student Name
            </label>
            <input
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body text-on-surface"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Grade */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label block">
                Grade
              </label>
              <div className="relative">
                <select
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none appearance-none cursor-pointer font-body text-on-surface"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                >
                  <option value={10}>Grade 10</option>
                  <option value={11}>Grade 11</option>
                  <option value={12}>Grade 12</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label block">
                Difficulty Level
              </label>
              <div className="relative">
                <select
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none appearance-none cursor-pointer font-body text-on-surface"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                >
                  <option value={1}>Level 1</option>
                  <option value={2}>Level 2</option>
                  <option value={3}>Level 3</option>
                  <option value={4}>Level 4</option>
                  <option value={5}>Level 5</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Word Count */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label block">
              Assigned Word Count
            </label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body text-on-surface"
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant/60">
                words
              </span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-surface-container-low/50 border-t border-outline-variant/20 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all font-body"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-[0_4px_12px_rgba(0,45,143,0.3)] hover:shadow-[0_6px_16px_rgba(0,45,143,0.4)] hover:-translate-y-0.5 transition-all active:translate-y-0 font-body"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
