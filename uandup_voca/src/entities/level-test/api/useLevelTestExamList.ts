import { useQuery } from '@tanstack/react-query';
import { getLevelTestExamList } from './levelTestApi';
import { toLevelTestExamRow } from '../model/mapper';
import { levelTestKeys } from './queryKeys';

export function useLevelTestExamList(studentId: number) {
  return useQuery({
    queryKey: levelTestKeys.exams(studentId),
    queryFn: () => getLevelTestExamList(studentId),
    select: (res) => (res.data ?? []).map(toLevelTestExamRow),
    enabled: studentId > 0,
  });
}
