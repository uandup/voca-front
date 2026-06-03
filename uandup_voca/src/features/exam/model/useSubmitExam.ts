import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitExam, testKeys } from '@/entities/test';
import { reviewDeckKeys } from '@/entities/review-deck';
import { levelTestKeys } from '@/entities/level-test';
import { studentKeys } from '@/entities/student';

// 학생이 자신의 답안을 제출한다.
// 제출 후 어떤 캐시를 갱신해야 하는지는 시험 종류에 따라 달라지므로 source를 명시받는다.
//   - 'study-set' : study-set 기반 step 시험 (WORD/EXAMPLE/REVIEWn) — clinic-detail 또는 student WordTest 리스트
//   - 'review-deck': 학생-단위 오답 뱅크 시험
//   - 'level-test' : 학생-단위 레벨 시험
export type SubmitExamSource = 'study-set' | 'review-deck' | 'level-test';

interface UseSubmitExamParams {
  examId: number;
  studentId: number;
  source: SubmitExamSource;
}

export function useSubmitExam({ examId, studentId, source }: UseSubmitExamParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof submitExam>[1]) => submitExam(examId, payload),
    onSuccess: () => {
      // 제출 직후 examDetail은 SUBMITTED 상태로 바뀌므로 항상 invalidate.
      queryClient.invalidateQueries({ queryKey: testKeys.examDetail(examId) });
      // 제출 후 TodoList에서 완료된 항목이 즉시 사라지도록 항상 invalidate.
      queryClient.invalidateQueries({ queryKey: studentKeys.todos(studentId) });

      if (source === 'review-deck') {
        queryClient.invalidateQueries({ queryKey: reviewDeckKeys.exams(studentId) });
      } else if (source === 'level-test') {
        queryClient.invalidateQueries({ queryKey: levelTestKeys.exams(studentId) });
      } else {
        // study-set 기반 시험 — 학생의 study-set 목록과 step 카드를 함께 갱신.
        queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });
      }
    },
  });
}
