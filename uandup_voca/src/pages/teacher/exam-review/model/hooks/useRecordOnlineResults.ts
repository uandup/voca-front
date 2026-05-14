import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordOnlineResults, testKeys } from '@/entities/test';
import type { ExamType } from '@/entities/test';
import { studentKeys } from '@/entities/student';

interface Params {
  examId: number;
  studentId: number;
  studySetId: number;
  examType: ExamType;
}

// 온라인 채점 결과 저장 mutation.
// 채점 후엔 clinic-detail이 보는 step 상태가 바뀌므로 다음 세 키를 invalidate한다 — useExamActions와 동일 범위.
//   - testKeys.examDetail(examId)               : 현재 페이지(review) 재렌더 시 graded 상태 반영
//   - testKeys.history(studySetId, examType)    : clinic StepPanel이 보는 step별 이력
//   - studentKeys.studySets(studentId)          : clinic WordTestTab의 study-set 리스트
export function useRecordOnlineResults({ examId, studentId, studySetId, examType }: Params) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof recordOnlineResults>[1]) =>
      recordOnlineResults(examId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testKeys.examDetail(examId) });
      queryClient.invalidateQueries({ queryKey: testKeys.history(studySetId, examType) });
      queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });
    },
  });
}
