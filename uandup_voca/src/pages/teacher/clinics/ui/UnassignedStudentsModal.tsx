import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { useUnassignedStudents } from '../model/hooks/useUnassignedStudents';
import { UnassignedAssignmentRow } from './UnassignedAssignmentRow';

interface Props {
  onClose: () => void;
}

export function UnassignedStudentsModal({ onClose }: Props) {
  const { students, isLoading } = useUnassignedStudents();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">Unassigned Students</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {students.length} student{students.length !== 1 ? 's' : ''} without word assignment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* List */}
        <div
          className="overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40"
          style={{ height: '390px' }}
        >
          {isLoading ? null : students.length === 0 ? (
            <div className="flex flex-col pb-24 items-center justify-center h-full text-on-surface-variant/50">
              <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
              <p className="text-sm font-bold">All students assigned!</p>
            </div>
          ) : (
            students.map((student) => (
              <UnassignedAssignmentRow
                key={student.id}
                student={student}
                isExpanded={expandedId === student.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === student.id ? null : student.id))
                }
              />
            ))
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}
