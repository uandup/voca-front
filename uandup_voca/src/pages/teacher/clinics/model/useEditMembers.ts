import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClinicStudents } from '@/entities/clinic';
import type { ClinicMemberStudent } from '@/entities/clinic';
import type { StudentGrade } from '@/entities/member';

interface EditData {
  allStudents: ClinicMemberStudent[];
  clinicStudentIds: Set<number>;
}

export function useEditMembers(
  data: EditData,
  dayOfWeek: string,
  hour: number,
  onClose: () => void,
) {
  const queryClient = useQueryClient();

  const [roster, setRoster] = useState<ClinicMemberStudent[]>(() =>
    data.allStudents.filter((s) => data.clinicStudentIds.has(s.id)),
  );
  const [available, setAvailable] = useState<ClinicMemberStudent[]>(() =>
    data.allStudents.filter((s) => !data.clinicStudentIds.has(s.id)),
  );
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<StudentGrade | ''>('');

  const saveMutation = useMutation({
    mutationFn: () =>
      updateClinicStudents(dayOfWeek, hour, { studentIds: roster.map((s) => s.id) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics', dayOfWeek, hour] });
      onClose();
    },
  });

  function removeFromRoster(student: ClinicMemberStudent) {
    setRoster((prev) => prev.filter((s) => s.id !== student.id));
    setAvailable((prev) => [...prev, student]);
  }

  function addToRoster(student: ClinicMemberStudent) {
    setAvailable((prev) => prev.filter((s) => s.id !== student.id));
    setRoster((prev) => [...prev, student]);
  }

  const filteredAvailable = available.filter((s) => {
    const matchesSearch =
      s.nameKo.toLowerCase().includes(search.toLowerCase()) ||
      s.englishName.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter ? s.grade === gradeFilter : true;
    return matchesSearch && matchesGrade;
  });

  return {
    roster,
    filteredAvailable,
    search,
    setSearch,
    gradeFilter,
    setGradeFilter,
    addToRoster,
    removeFromRoster,
    saveMutation,
  };
}
