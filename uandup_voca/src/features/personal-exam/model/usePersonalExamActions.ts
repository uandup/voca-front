import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPersonalExam,
  cancelPersonalExam,
  toCreatePersonalExamRequest,
  personalExamKeys,
} from '@/entities/personal-exam';
import type { CreatePersonalExamPayload } from '@/entities/personal-exam';

interface UsePersonalExamActionsParams {
  studentId: number;
  // 활성 시험이 없으면(create 직전) null. cancel은 자연스럽게 비활성.
  currentPersonalExamId: number | null;
}

// personal-exam 도메인에서 발생하는 mutation 묶음 — review-deck-exam(useReviewDeckExamActions)과
// 같은 성격이지만 두 가지가 다르다.
//   - startOnline이 없다: PersonalExam은 ONLINE_STARTED 단계가 없어(생성 즉시 응시 가능) 별도
//     "시작" mutation이 필요 없다.
//   - attempt/submit이 여기 없다: attempt는 상태를 바꾸는 1회성 POST라 useMutation보다
//     entities/test의 useExamAttempt와 같은 ref-가드 패턴이 맞아
//     entities/personal-exam/api/usePersonalExamAttempt.ts로 옮겼고, submit은 여러 시험
//     패밀리가 공유하는 features/exam의 useSubmitExam이 source='personal'로 분기해 처리한다
//     (review-deck/level-test가 study-set 기반 시험과 submit 하나를 공유하는 것과 동일 이유).
export function usePersonalExamActions({
  studentId,
  currentPersonalExamId,
}: UsePersonalExamActionsParams) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: personalExamKeys.exams(studentId) });
  };

  const create = useMutation({
    mutationFn: (payload: CreatePersonalExamPayload) =>
      createPersonalExam(studentId, toCreatePersonalExamRequest(payload)),
    onSuccess: invalidateAll,
  });

  const cancel = useMutation({
    mutationFn: () => cancelPersonalExam(currentPersonalExamId!),
    onSuccess: () => {
      if (currentPersonalExamId !== null) {
        queryClient.invalidateQueries({ queryKey: personalExamKeys.detail(currentPersonalExamId) });
      }
      invalidateAll();
    },
  });

  return { create, cancel };
}
