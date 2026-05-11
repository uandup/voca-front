import { useQuery } from '@tanstack/react-query';
import { getStudySetList, toStudySetRow } from '@/entities/student';

export function useStudySetList(studentId: number) {
  return useQuery({
    queryKey: ['clinic-detail', studentId, 'study-sets'],
    queryFn: () => getStudySetList(studentId),
    select: (res) => (res.data ?? []).map(toStudySetRow),
    staleTime: Infinity,
  });
}
