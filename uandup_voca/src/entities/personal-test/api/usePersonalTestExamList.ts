import { useQuery } from '@tanstack/react-query';
import { getPersonalTestExamList } from './personalTestApi';
import { toPersonalTestExamRow } from '../model/mapper';
import { personalTestKeys } from './queryKeys';

export function usePersonalTestExamList(studentId: number) {
  return useQuery({
    queryKey: personalTestKeys.exams(studentId),
    queryFn: () => getPersonalTestExamList(studentId),
    select: (res) => (res.data ?? []).map(toPersonalTestExamRow),
    enabled: studentId > 0,
  });
}
