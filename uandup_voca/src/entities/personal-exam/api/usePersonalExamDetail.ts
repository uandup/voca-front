import { useQuery } from '@tanstack/react-query';
import { getPersonalExamDetail } from './personalExamApi';
import { toPersonalExamDetail } from '../model/mapper';
import { personalExamKeys } from './queryKeys';

// entities/test의 useExamDetail과 동일한 패턴 — PersonalExam은 자체 엔드포인트
// (/api/v1/personal-exams/{id})를 쓰므로 별도로 둔다. pages/student/exam-review의
// useExamReview가 source==='personal'일 때 entities/test의 useExamDetail 대신 이걸 쓴다.
export function usePersonalExamDetail(personalExamId: number | null) {
  return useQuery({
    queryKey: personalExamKeys.detail(personalExamId ?? -1),
    queryFn: () => getPersonalExamDetail(personalExamId!),
    select: (res) => toPersonalExamDetail(res.data!),
    enabled: personalExamId !== null,
  });
}
