import { useQuery } from '@tanstack/react-query';
import { getLevelTestExamList, levelTestKeys, toLevelTestExamRow } from '@/entities/level-test';

export function useLevelTestExamList(studentId: number) {
  return useQuery({
    queryKey: levelTestKeys.exams(studentId),
    queryFn: () => getLevelTestExamList(studentId),
    select: (res) => (res.data ?? []).map(toLevelTestExamRow),
    enabled: studentId > 0,
  });
}
