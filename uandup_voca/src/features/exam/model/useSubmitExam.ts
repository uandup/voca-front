import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitExam, testKeys } from '@/entities/test';
import { reviewDeckKeys } from '@/entities/review-deck';
import { levelTestKeys } from '@/entities/level-test';
import { personalTestKeys } from '@/entities/personal-test';
import { studentKeys } from '@/entities/student';

// 학생이 자신의 답안을 제출한다.
// 제출 후 어떤 캐시를 갱신해야 하는지는 시험 종류에 따라 달라지므로 source를 명시받는다.
//   - 'study-set' : study-set 기반 step 시험 (WORD/EXAMPLE/REVIEWn) — clinic-detail 또는 student WordTest 리스트
//   - 'review-deck': 학생-단위 오답 뱅크 시험
//   - 'level-test' : 학생-단위 레벨 시험
//   - 'personal-test': 학생-단위 개인 단어장 시험
export type SubmitExamSource = 'study-set' | 'review-deck' | 'level-test' | 'personal-test';

interface UseSubmitExamParams {
  examId: number;
  studentId: number;
  source: SubmitExamSource;
}

// 세 출처가 공유하는 제출 페이로드 형태. 호출부(useExamTake 등)는 source와 무관하게
// 항상 이 형태로 mutate한다.
type SubmitExamPayload = Parameters<typeof submitExam>[1];

export function useSubmitExam({ examId, studentId, source }: UseSubmitExamParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitExamPayload) => submitExam(examId, payload),
    onSuccess: () => {
      // 제출 후 TodoList에서 완료된 항목이 즉시 사라지도록 항상 invalidate.
      queryClient.invalidateQueries({ queryKey: studentKeys.todos(studentId) });

      // 제출 직후 examDetail은 SUBMITTED 상태로 바뀌므로 항상 invalidate.
      queryClient.invalidateQueries({ queryKey: testKeys.examDetail(examId) });

      if (source === 'review-deck') {
        queryClient.invalidateQueries({ queryKey: reviewDeckKeys.exams(studentId) });
      } else if (source === 'level-test') {
        queryClient.invalidateQueries({ queryKey: levelTestKeys.exams(studentId) });
      } else if (source === 'personal-test') {
        queryClient.invalidateQueries({ queryKey: personalTestKeys.exams(studentId) });
      } else {
        // study-set 기반 시험 — 학생의 study-set 목록과 step 카드를 함께 갱신.
        queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });
      }
    },
  });
}
