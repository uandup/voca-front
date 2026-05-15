import { useQuery } from '@tanstack/react-query';
import { getStudySetList, toStudySetRow, studentKeys } from '@/entities/student';

export function useStudySetList(studentId: number) {
  return useQuery({
    queryKey: studentKeys.studySets(studentId),
    queryFn: () => getStudySetList(studentId),
    select: (res) => (res.data ?? []).map(toStudySetRow),
    enabled: studentId > 0,
  });
}
