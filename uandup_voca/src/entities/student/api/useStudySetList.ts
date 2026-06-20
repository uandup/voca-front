import { useQuery } from '@tanstack/react-query';
import { getActiveStudySetList } from './studentApi';
import { toStudySetRow } from '../model/mapper';
import { studentKeys } from './queryKeys';

export function useActiveStudySetList(studentId: number) {
  return useQuery({
    queryKey: studentKeys.studySets(studentId),
    queryFn: () => getActiveStudySetList(studentId),
    select: (res) => (res.data ?? []).map(toStudySetRow),
    enabled: studentId > 0,
  });
}
