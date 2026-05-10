import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PageTitle } from '@/shared/ui/PageTitle';
import { MemoPopup } from '@/features/memo';
import { todayDay } from '@/entities/clinic';
import type { Day, TimeGroup, ClinicHour } from '@/entities/clinic';
import type { ClinicStudentRow } from '@/entities/clinic';
import { useClinics } from './model/hooks/useClinics';
import { SessionPanel } from './ui/SessionPanel';
import { StudentTable } from './ui/StudentTable';
import { EditMembersModal } from './ui/EditMembersModal';

export default function ClinicsPage() {
  const [selectedSlot, setSelectedSlot] = useState<{ day: Day; hour: ClinicHour }>({
    day: todayDay,
    hour: 9,
  });
  const [expandedGroups, setExpandedGroups] = useState<Record<TimeGroup, boolean>>({
    morning: true,
    afternoon: true,
    evening: true,
  });
  const [memoStudent, setMemoStudent] = useState<ClinicStudentRow | null>(null);
  const [isEditMembersOpen, setIsEditMembersOpen] = useState(false);

  const queryClient = useQueryClient();
  const { students } = useClinics(selectedSlot.day, selectedSlot.hour);

  function handlePrevDay() {
    setSelectedSlot((prev) => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
      const idx = days.indexOf(prev.day);
      return { ...prev, day: days[(idx - 1 + days.length) % days.length] };
    });
  }

  function handleNextDay() {
    setSelectedSlot((prev) => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
      const idx = days.indexOf(prev.day);
      return { ...prev, day: days[(idx + 1) % days.length] };
    });
  }

  return (
    <main>
      <PageTitle title="Clinics" />

      <div className="grid grid-cols-12 gap-8 items-start">
        <SessionPanel
          selectedSlot={selectedSlot}
          expandedGroups={expandedGroups}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onSelectHour={(hour) => setSelectedSlot((prev) => ({ ...prev, hour }))}
          onToggleGroup={(group) =>
            setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }))
          }
        />
        <StudentTable
          students={students}
          onMemoClick={setMemoStudent}
          onEditMembersClick={() => setIsEditMembersOpen(true)}
        />
      </div>

      {isEditMembersOpen && (
        <EditMembersModal
          day={selectedSlot.day}
          hour={selectedSlot.hour}
          onClose={() => setIsEditMembersOpen(false)}
        />
      )}
      {memoStudent && (
        <MemoPopup
          studentId={memoStudent.id}
          studentName={memoStudent.nameKo}
          onClose={() => setMemoStudent(null)}
          onMutationSuccess={() => queryClient.invalidateQueries({ queryKey: ['clinics'] })}
        />
      )}
    </main>
  );
}
