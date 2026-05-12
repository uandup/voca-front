import { useQuery } from '@tanstack/react-query';
import { getStudentOverview, toStudentOverview, studentKeys } from '@/entities/student';

export function useStudentOverview(studentId: number) {
  return useQuery({
    queryKey: studentKeys.overview(studentId),
    queryFn: () => getStudentOverview(studentId),
    select: (res) => toStudentOverview(res.data!),
  });
}
