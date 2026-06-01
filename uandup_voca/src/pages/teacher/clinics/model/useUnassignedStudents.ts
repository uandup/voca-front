import { useQuery } from '@tanstack/react-query';
import { getUnassignedStudents, toUnassignedStudentRow, studentKeys } from '@/entities/student';

export function useUnassignedStudents() {
  const { data, isLoading } = useQuery({
    queryKey: studentKeys.unassigned(),
    queryFn: getUnassignedStudents,
    select: (res) => res.data?.map(toUnassignedStudentRow) ?? [],
  });

  return { students: data ?? [], isLoading };
}
