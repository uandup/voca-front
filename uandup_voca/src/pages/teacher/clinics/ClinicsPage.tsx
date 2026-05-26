import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { MemoPopup } from '@/features/memo';
import type { ClinicStudentRow } from '@/entities/clinic';
import { useClinics } from './model/useClinics';
import { useClinicViewState } from './model/useClinicViewState';
import { SessionPanel } from './ui/SessionPanel';
import { ClinicStudentTable } from './ui/ClinicStudentTable';
import { EditMembersModal } from './ui/EditMembersModal';
import { UnassignedStudentsModal } from './ui/UnassignedStudentsModal';

export default function ClinicsPage() {
  const { selectedSlot, setSelectedSlot, expandedGroups, setExpandedGroups } = useClinicViewState();
  const [memoStudent, setMemoStudent] = useState<ClinicStudentRow | null>(null);
  const [isEditMembersOpen, setIsEditMembersOpen] = useState(false);
  const [isUnassignedOpen, setIsUnassignedOpen] = useState(false);

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
      {/* PageTitle은 mb-6를 자체적으로 가지므로, 라벨과 수평 정렬만 잡아준다 */}
      <div className="flex items-end gap-3">
        <PageTitle title="Clinics" />
        <button
          type="button"
          onClick={() => setIsUnassignedOpen(true)}
          className="mb-7 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-outline-variant/70 text-xs font-bold text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            group_off
          </span>
          Unassigned Students
        </button>
      </div>

      <div className="grid grid-cols-14 gap-8 items-start">
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
        <ClinicStudentTable
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
        />
      )}
      {isUnassignedOpen && <UnassignedStudentsModal onClose={() => setIsUnassignedOpen(false)} />}
    </main>
  );
}
