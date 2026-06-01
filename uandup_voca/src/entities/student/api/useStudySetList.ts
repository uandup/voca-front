import { useQuery } from '@tanstack/react-query';
import { getStudySetList } from './studentApi';
import { toStudySetRow } from '../model/mapper';
import { studentKeys } from './queryKeys';

export function useStudySetList(studentId: number) {
  return useQuery({
    queryKey: studentKeys.studySets(studentId),
    queryFn: () => getStudySetList(studentId),
    select: (res) => (res.data ?? []).map(toStudySetRow),
    enabled: studentId > 0,
  });
}
