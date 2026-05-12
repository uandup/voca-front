import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClinicEditData,
  updateClinicStudents,
  DAY_API_MAP,
  clinicKeys,
} from '@/entities/clinic';
import type { Day, ClinicHour } from '@/entities/clinic';
import { toClinicMemberStudent } from '../mapper';
import type { ClinicMemberStudent } from '../types';
import type { StudentGrade } from '@/entities/member';

interface EditData {
  allStudents: ClinicMemberStudent[];
  clinicStudentIds: Set<number>;
}

export function useClinicMembersQuery(day: Day, hour: ClinicHour) {
  const dayOfWeek = DAY_API_MAP[day];
  return useQuery({
    queryKey: clinicKeys.edit(day, hour),
    queryFn: () => getClinicEditData(dayOfWeek, hour),
    select: (res): EditData => ({
      allStudents: (res.data?.allStudents ?? []).map(toClinicMemberStudent),
      clinicStudentIds: new Set(res.data?.clinicStudentIds ?? []),
    }),
  });
}

export function useClinicMembers(data: EditData, day: Day, hour: ClinicHour, onClose: () => void) {
  const dayOfWeek = DAY_API_MAP[day];
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
      queryClient.invalidateQueries({ queryKey: clinicKeys.list(day, hour) });
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
