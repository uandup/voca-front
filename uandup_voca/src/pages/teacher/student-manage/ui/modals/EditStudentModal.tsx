import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { NumberInput } from '@/shared/ui/NumberInput';
import type { ManagedStudent, TestType, ParentInfo } from '../../mock/studentManageMockData';
import { PARENT_MOCK } from '../../mock/studentManageMockData';
import { ParentListPanel } from './ParentListPanel';
import { ClassListPanel } from './ClassListPanel';
import { ClassChips } from '../ClassChips';

interface EditStudentModalProps {
  student: ManagedStudent;
  onClose: () => void;
  onSave: (updated: ManagedStudent) => void;
}

const TEST_TYPES: TestType[] = ['Meaning to Word', 'Word to Meaning'];

const TEST_TYPE_LABELS: Record<TestType, string> = {
  'Meaning to Word': 'Meaning to Word ( M to W )',
  'Word to Meaning': 'Word to Meaning ( W to M )',
};

const ALL_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function EditStudentModal({ student, onClose, onSave }: EditStudentModalProps) {
  const [nameFirstKo, setNameFirstKo] = useState(student.nameFirstKo);
  const [nameLastKo, setNameLastKo] = useState(student.nameLastKo);
  const [nameFirstEn, setNameFirstEn] = useState(student.nameFirstEn);
  const [nameLastEn, setNameLastEn] = useState(student.nameLastEn);
  const [grade, setGrade] = useState(student.grade);
  const [level, setLevel] = useState(student.assignedLevel);
  const [wordCount, setWordCount] = useState(String(student.assignedWordCount));
  const [testQuestionCount, setTestQuestionCount] = useState(String(student.testQuestionCount));
  const [testType, setTestType] = useState<TestType>(student.testConfig.type);
  const [includeSynonyms, setIncludeSynonyms] = useState(student.testConfig.includeSynonyms);
  const [selectedParent, setSelectedParent] = useState<ParentInfo | null>(
    student.parentName ? (PARENT_MOCK.find((p) => p.name === student.parentName) ?? null) : null,
  );
  const [showParentList, setShowParentList] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(student.classes);
  const [showClassList, setShowClassList] = useState(false);

  function handleSave() {
    onSave({
      ...student,
      nameFirstKo,
      nameLastKo,
      nameFirstEn,
      nameLastEn,
      grade,
      assignedLevel: level,
      assignedWordCount: Number(wordCount),
      testQuestionCount: Number(testQuestionCount),
      testConfig: { type: testType, includeSynonyms },
      parentName: selectedParent?.name,
      parentPhone: selectedParent?.phone,
      classes: selectedClasses,
    });
    onClose();
  }

  return (
    <ModalBackdrop onClose={onClose}>
      {/* 편집 모달 — 항상 중앙 고정, relative로 학부모 패널 기준점 제공 */}
      <div className="relative">
        {/* 편집 모달 */}
        <div className="w-120 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-8 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-white shrink-0">
            <h2 className="text-xl font-extrabold font-headline tracking-tight text-primary">
              Edit Student
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-8 flex flex-col gap-6 overflow-y-auto">
            {/* 이름 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Last Name (Korean)
                </label>
                <input
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={nameLastKo}
                  onChange={(e) => setNameLastKo(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  First Name (Korean)
                </label>
                <input
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={nameFirstKo}
                  onChange={(e) => setNameFirstKo(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Last Name (English)
                </label>
                <input
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={nameLastEn}
                  onChange={(e) => setNameLastEn(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  First Name (English)
                </label>
                <input
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={nameFirstEn}
                  onChange={(e) => setNameFirstEn(e.target.value)}
                />
              </div>
            </div>

            {/* 학년 + 레벨 */}
            <div className="grid grid-cols-2 gap-4">
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Difficulty Level
                </label>
                <div className="relative">
                  <select
                    className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                  >
                    {ALL_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        Level {l}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* 배정 단어 개수 + 시험 문항 개수 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Assigned QTY
                </label>
                <NumberInput
                  value={wordCount}
                  onChange={setWordCount}
                  min={1}
                  className="w-full border border-outline-variant/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Test QTY
                </label>
                <NumberInput
                  value={testQuestionCount}
                  onChange={setTestQuestionCount}
                  min={1}
                  className="w-full border border-outline-variant/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* 시험 설정 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Exam Config
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <select
                    className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as TestType)}
                  >
                    {TEST_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {TEST_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeSynonyms((v) => !v)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    includeSynonyms
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  +Syn
                </button>
              </div>
            </div>

            {/* 반 정보 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Class Info
                </label>
                <div className="flex-1 h-px bg-outline-variant/20" />
                <button
                  type="button"
                  onClick={() => {
                    setShowClassList((v) => !v);
                    setShowParentList(false);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    showClassList
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {showClassList ? 'chevron_right' : 'chevron_left'}
                  </span>
                  Select Class
                </button>
              </div>

              {/* 선택된 반 표시 */}
              {selectedClasses.length > 0 ? (
                <ClassChips
                  classes={selectedClasses}
                  onRemove={(c) => setSelectedClasses((prev) => prev.filter((x) => x !== c))}
                />
              ) : (
                <p className="text-xs text-on-surface-variant/60 px-1">No class selected</p>
              )}
            </div>

            {/* 학부모 정보 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Parent Info
                </label>
                <div className="flex-1 h-px bg-outline-variant/20" />
                <button
                  type="button"
                  onClick={() => {
                    setShowParentList((v) => !v);
                    setShowClassList(false);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    showParentList
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {showParentList ? 'chevron_right' : 'chevron_left'}
                  </span>
                  Select Parent
                </button>
              </div>

              {/* 선택된 학부모 표시 */}
              {selectedParent ? (
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{selectedParent.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{selectedParent.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedParent(null)}
                    className="p-1 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant/60 px-1">No parent selected</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-outline-variant/30 flex justify-end gap-3 bg-white shrink-0">
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

        {/* 반 리스트 패널 */}
        {showClassList && (
          <ClassListPanel selectedClasses={selectedClasses} onChange={setSelectedClasses} />
        )}

        {/* 학부모 리스트 패널 — 편집 모달 오른쪽에 absolute로 고정 */}
        {showParentList && (
          <ParentListPanel
            selectedId={selectedParent?.id ?? null}
            onSelect={(parent) => {
              setSelectedParent(parent);
              setShowParentList(false);
            }}
          />
        )}
      </div>
    </ModalBackdrop>
  );
}
