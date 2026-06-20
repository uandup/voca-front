import { useState } from 'react';
import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { MemoPopup } from '@/features/memo';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { StudentInfoCard } from './ui/StudentInfoCard';
import { QuickAssignmentCard } from './ui/QuickAssignmentCard';
import WordTestTab from './ui/WordTestTab';
import { LevelTestTab } from './ui/LevelTestTab';
import { WrongWordBankTab } from './ui/WrongWordBankTab';
import { useStudentOverview } from '@/entities/student';

type MainTab = 'wordTest' | 'reviewDeck' | 'levelTest';

export function ClinicDetailPage() {
  const { studentId: studentIdParam } = useParams({
    from: '/teacher/clinics_/students/$studentId',
  });
  const studentId = Number(studentIdParam);
  const navigate = useNavigate();

  const { data: student, isLoading: overviewLoading } = useStudentOverview(studentId);

  const [isMemoOpen, setIsMemoOpen] = useState(false);

  // mainTab은 URL search param으로 영속화 — preview/review 페이지 이동 후 Exit으로 돌아올 때
  // 직전 탭이 복원되도록 한다(returnTo가 현재 URL을 통째로 캡처하므로 자연스럽게 살아남는다).
  const { tab } = useSearch({ from: '/teacher/clinics_/students/$studentId' });
  const mainTab: MainTab = tab ?? 'wordTest';
  const setMainTab = (next: MainTab) => {
    navigate({
      to: '.',
      // 탭 전환 시 다른 탭의 펼침 상태(openSet/openStep)는 의미가 없으므로 함께 비운다.
      search: { tab: next === 'wordTest' ? undefined : next },
    });
  };

  if (overviewLoading || !student) {
    return (
      <main className="p-8">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main>
      <div className="overflow-x-auto">
        <div className="min-w-275 space-y-8">
          <BreadcrumbPageTitle
            parents={[{ label: 'Clinics', onClick: () => navigate({ to: '/teacher/clinics' }) }]}
            title={
              student.englishName ? `${student.nameKo} (${student.englishName})` : student.nameKo
            }
          />

          {/* Top Section: Student Info & Quick Assignment */}
          <div className="grid grid-cols-12 gap-6 items-stretch">
            <StudentInfoCard
              student={student}
              latestMemo={student.latestMemo ?? undefined}
              onMemoClick={() => setIsMemoOpen(true)}
            />
            <QuickAssignmentCard studentId={studentId} />
          </div>

          {/* Bottom Section: Tab System */}
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-outline/20 pb-px">
              <div className="flex gap-8">
                {(
                  [
                    { key: 'wordTest', label: 'Word Test' },
                    { key: 'reviewDeck', label: 'Review Deck' },
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

            {mainTab === 'wordTest' && <WordTestTab studentId={studentId} />}

            {mainTab === 'reviewDeck' && <WrongWordBankTab studentId={studentId} />}

            {mainTab === 'levelTest' && <LevelTestTab studentId={studentId} />}
          </div>
        </div>
      </div>

      {isMemoOpen && (
        <MemoPopup
          studentId={student.id}
          studentName={student.nameKo}
          onClose={() => setIsMemoOpen(false)}
        />
      )}
    </main>
  );
}
