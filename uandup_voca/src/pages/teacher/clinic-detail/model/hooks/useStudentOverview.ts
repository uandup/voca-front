import { useQuery } from '@tanstack/react-query';
import { getStudentOverview, toStudentOverview } from '@/entities/student';

export function useStudentOverview(studentId: number) {
  return useQuery({
    queryKey: ['clinic-detail', studentId, 'overview'],
    queryFn: () => getStudentOverview(studentId),
    select: (res) => toStudentOverview(res.data!),
    staleTime: Infinity,
  });
}
