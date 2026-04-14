import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { PageTitle } from '@/shared/ui/PageTitle';
import { AssignedLevelBlocks } from '@/entities/vocab';
import { TestConfigBadges } from '@/entities/test';
import { MemoPopup, type MemoItem } from '@/entities/student';
import { CLINIC_MOCK } from '@/pages/teacher/clinics/mock/clinicMockData';
import { WordTestTable } from '@/pages/teacher/clinics/ui/WordTestTable';
import { ReviewTestTable } from '@/pages/teacher/clinics/ui/ReviewTestTable';
import { mockWordTests, mockReviewTests } from '@/pages/teacher/clinics/mock/studentTestMockData';

type TestTab = 'word' | 'review';

const levelProgress = [
  { label: 'Level 1 Progress', value: '120/1040' },
  { label: 'Level 2 Progress', value: '150/1040' },
  { label: 'Level 3 Progress', value: '180/1040' },
  { label: 'Level 4 Progress', value: '0/1040' },
];

export function ClinicDetailPage() {
  const { studentId } = useParams({ from: '/teacher/clinics_/$studentId' });
  const navigate = useNavigate();

  const student = CLINIC_MOCK.sessions.flatMap((s) => s.students).find((s) => s.id === studentId);

  const [memos, setMemos] = useState<MemoItem[]>(student?.memos ?? []);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TestTab>('word');
  const [pendingOnly, setPendingOnly] = useState(false);

  const alreadyAssigned = mockWordTests.some((t) => t.status === 'Pending');

  if (!student) {
    return (
      <main>
        <p className="text-on-surface-variant">학생 정보를 찾을 수 없습니다.</p>
      </main>
    );
  }

  const latestMemo = [...memos].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <main>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate({ to: '/teacher/clinics' })}
          className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <PageTitle title={`${student.nameLastKo}${student.nameFirstKo}`} />
        <span className="text-base text-on-surface-variant font-medium mt-1">
          {student.nameFirstEn} {student.nameLastEn}
        </span>
        <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full mt-1">
          {student.grade}
        </span>
        <button
          onClick={() => setIsMemoOpen(true)}
          className="mt-1 p-1.5 rounded-md text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="메모 보기"
        >
          <span className="material-symbols-outlined text-base">sticky_note_2</span>
        </button>
        {latestMemo && (
          <span className="mt-1 text-xs text-on-surface-variant truncate max-w-xs">
            {latestMemo.content}
          </span>
        )}
      </div>

      {/* Stats Row */}
      <section className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest px-5 py-4 rounded-xl border border-primary/5 shadow-sm flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface-variant">Level</span>
          <AssignedLevelBlocks level={student.assignedLevel} />
        </div>
        <div className="bg-surface-container-lowest px-5 py-4 rounded-xl border border-primary/5 shadow-sm flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface-variant">QTY</span>
          <span className="font-headline font-bold text-primary text-lg">
            {student.assignedWordCount}
          </span>
        </div>
        <div className="bg-surface-container-lowest px-5 py-4 rounded-xl border border-primary/5 shadow-sm flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface-variant">Test Q</span>
          <span className="font-headline font-bold text-primary text-lg">
            {student.testQuestionCount}
          </span>
        </div>
        <div className="bg-surface-container-lowest px-5 py-4 rounded-xl border border-primary/5 shadow-sm flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface-variant">Config</span>
          <TestConfigBadges config={student.testConfig} />
        </div>
      </section>

      {/* Level Progress */}
      <section className="grid grid-cols-4 gap-4 mb-8">
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                  <button
                    key={lvl}
                    className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-all rounded-md"
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <label
                className="text-sm font-bold text-primary-container whitespace-nowrap"
                htmlFor="detail_words_input"
              >
                Quantity:
              </label>
              <input
                id="detail_words_input"
                className="w-32 bg-surface-container-low border-none rounded-lg py-1.5 pl-3 pr-3 text-xs font-bold text-primary-container focus:ring-1 focus:ring-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                type="number"
                defaultValue={student.assignedWordCount}
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

      {isMemoOpen && (
        <MemoPopup
          studentName={`${student.nameLastKo}${student.nameFirstKo}`}
          memos={memos}
          onClose={() => setIsMemoOpen(false)}
          onChange={(newMemos) => setMemos(newMemos)}
        />
      )}
    </main>
  );
}
