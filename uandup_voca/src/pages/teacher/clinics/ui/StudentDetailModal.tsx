import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { WordTestTable } from './WordTestTable';
import { ReviewTestTable } from './ReviewTestTable';
import { mockWordTests, mockReviewTests } from '../mock/studentTestMockData';
import type { ClinicStudent } from '../mock/clinicMockData';

interface StudentDetailModalProps {
  student: ClinicStudent;
  onClose: () => void;
}

type TestTab = 'word' | 'review';

const levelProgress = [
  { label: 'Level 1 Progress', value: '120/1040' },
  { label: 'Level 2 Progress', value: '150/1040' },
  { label: 'Level 3 Progress', value: '180/1040' },
  { label: 'Level 4 Progress', value: '0/1040' },
];

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  const [selectedLevels, setSelectedLevels] = useState<number[]>([1]);
  const [selectedTab, setSelectedTab] = useState<TestTab>('word');
  const [pendingOnly, setPendingOnly] = useState(false);

  const alreadyAssigned = mockWordTests.some((t) => t.status === 'Pending');

  function toggleLevel(level: number) {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.length > 1
          ? prev.filter((l) => l !== level)
          : prev // 최소 1개 유지
        : [...prev, level],
    );
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-7xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-4 shadow-sm border-b border-outline-variant/30 flex justify-between items-center shrink-0 bg-surface">
          <div className="flex items-center gap-3">
            <h2 className="font-headline text-2xl font-bold text-primary">
              {student.nameLastKo}
              {student.nameFirstKo}
            </h2>
            <span className="text-sm text-on-surface-variant font-medium">
              {student.nameFirstEn} {student.nameLastEn}
            </span>
            <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full">
              {student.grade}
            </span>
            {student.memos.length > 0 && (
              <span className="material-symbols-outlined text-on-surface-variant text-base">
                sticky_note_2
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Student Profile Card */}
          <section className="mb-8">
            <div className="grid grid-cols-4 gap-4">
              {levelProgress.map((item) => (
                <div
                  key={item.label}
                  className="bg-surface-container-lowest px-4 py-4 rounded-lg border border-primary/5 shadow-sm"
                >
                  <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">
                    {item.label}
                  </span>
                  <span className="text-primary-container font-bold text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Assignment Bar */}
          <section className="mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-6 border border-primary/10">
              <div className="flex items-center gap-4 grow">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary-container whitespace-nowrap">
                    Difficulty:
                  </span>
                  <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
                    {[1, 2, 3, 4].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => toggleLevel(lvl)}
                        className={
                          selectedLevels.includes(lvl)
                            ? 'px-4 py-1.5 text-xs font-bold rounded-md bg-primary-container text-white shadow-sm transition-all'
                            : 'px-4 py-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-all'
                        }
                      >
                        Level {lvl}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <label
                    className="text-sm font-bold text-primary-container whitespace-nowrap"
                    htmlFor="modal_words_input"
                  >
                    Quantity:
                  </label>
                  <input
                    id="modal_words_input"
                    className="w-32 bg-surface-container-low border-none rounded-lg py-1.5 pl-3 pr-3 text-xs font-bold text-primary-container focus:ring-1 focus:ring-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    type="number"
                    defaultValue={25}
                    disabled={alreadyAssigned}
                  />
                </div>
                {alreadyAssigned && (
                  <div className="flex gap-4">
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Already Assigned
                    </div>
                  </div>
                )}
              </div>
              <button
                disabled={alreadyAssigned}
                className="bg-primary-container hover:opacity-90 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                Assign
              </button>
            </div>
          </section>

          {/* Test History */}
          <div>
            {/* 탭 + 필터 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
                {(['word', 'review'] as TestTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                      selectedTab === tab
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {tab === 'word' ? 'Word' : 'Review'}
                  </button>
                ))}
              </div>
              {selectedTab === 'review' && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pendingOnly}
                    onChange={(e) => setPendingOnly(e.target.checked)}
                    className="w-4 h-4 accent-primary-container cursor-pointer"
                  />
                  <span className="text-xs font-bold text-on-surface-variant">Pending only</span>
                </label>
              )}
            </div>
            {selectedTab === 'word' && <WordTestTable tests={mockWordTests} />}
            {selectedTab === 'review' && (
              <ReviewTestTable tests={mockReviewTests} showPendingOnly={pendingOnly} />
            )}
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
