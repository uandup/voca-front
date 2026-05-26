import { useQuery } from '@tanstack/react-query';
import { getStudentOverview } from './studentApi';
import { toStudentOverview } from '../model/mapper';
import { studentKeys } from './queryKeys';

export function useStudentOverview(studentId: number) {
  return useQuery({
    queryKey: studentKeys.overview(studentId),
    queryFn: () => getStudentOverview(studentId),
    select: (res) => toStudentOverview(res.data!),
    enabled: studentId > 0,
  });
}
