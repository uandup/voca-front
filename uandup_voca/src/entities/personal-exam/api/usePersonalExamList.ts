import { useQuery } from '@tanstack/react-query';
import { getPersonalExamList } from './personalExamApi';
import { toPersonalExamRow } from '../model/mapper';
import { personalExamKeys } from './queryKeys';

export function usePersonalExamList(studentId: number) {
  return useQuery({
    queryKey: personalExamKeys.exams(studentId),
    queryFn: () => getPersonalExamList(studentId),
    select: (res) => (res.data ?? []).map(toPersonalExamRow),
    enabled: studentId > 0,
  });
}
