import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { CLINIC_MOCK } from '@/pages/teacher/clinics/mock/clinicMockData';
import { MemoPopup, type MemoItem } from '@/entities/student';
import type { Vocab } from '@/entities/vocab/types/vocab';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { StudentInfoCard } from './ui/StudentInfoCard';
import { QuickAssignmentCard } from './ui/QuickAssignmentCard';
import { WordTestTab } from './ui/WordTestTab';

type MainTab = 'wordTest' | 'wrongWordBank' | 'levelTest';
type DifficultyLevel = Vocab['difficultyLevel'];

export function ClinicDetailPage() {
  const { studentId } = useParams({ from: '/teacher/clinics_/$studentId' });
  const navigate = useNavigate();

  const student = CLINIC_MOCK.sessions.flatMap((s) => s.students).find((s) => s.id === studentId);

  const [memos, setMemos] = useState<MemoItem[]>(student?.memos ?? []);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>('wordTest');

  const [assignTargetLevel, setAssignTargetLevel] = useState<DifficultyLevel>(4);
  const [assignQty, setAssignQty] = useState(50);

  if (!student) {
    return (
      <main className="p-8">
        <p className="text-on-surface-variant">학생 정보를 찾을 수 없습니다.</p>
      </main>
    );
  }

  const latestMemo = [...memos].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <BreadcrumbPageTitle
        parents={[{ label: 'Clinic', onClick: () => navigate({ to: '/teacher/clinics' }) }]}
        title={`${student.nameLastKo}${student.nameFirstKo} (${student.nameFirstEn} ${student.nameLastEn})`}
      />

      {/* Top Section: Student Info & Quick Assignment */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <StudentInfoCard
          student={student}
          latestMemo={latestMemo}
          onMemoClick={() => setIsMemoOpen(true)}
        />
        <QuickAssignmentCard
          targetLevel={assignTargetLevel}
          qty={assignQty}
          onTargetLevelChange={setAssignTargetLevel}
          onQtyChange={setAssignQty}
          onAssign={() => {}}
        />
      </div>

      {/* Bottom Section: Tab System */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-outline/20 pb-px">
          <div className="flex gap-8">
            {(
              [
                { key: 'wordTest', label: 'Word Test' },
                { key: 'wrongWordBank', label: 'Wrong Word Bank' },
                { key: 'levelTest', label: 'Level Test' },
              ] as { key: MainTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMainTab(tab.key)}
                className={`pb-3 text-sm font-bold relative transition-colors ${
                  mainTab === tab.key
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab.label}
                {mainTab === tab.key && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {mainTab === 'wordTest' && <WordTestTab />}

        {mainTab === 'wrongWordBank' && (
          <div className="bg-white border border-outline/20 rounded-2xl p-12 flex items-center justify-center">
            <p className="text-on-surface-variant text-sm font-medium">Wrong Word Bank — 준비 중</p>
          </div>
        )}

        {mainTab === 'levelTest' && (
          <div className="bg-white border border-outline/20 rounded-2xl p-12 flex items-center justify-center">
            <p className="text-on-surface-variant text-sm font-medium">Level Test — 준비 중</p>
          </div>
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
    </div>
  );
}
