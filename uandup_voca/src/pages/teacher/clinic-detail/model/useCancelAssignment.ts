import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelAssignment, invalidateStudentCascade } from '@/entities/student';
import type { StepCardVM } from '@/entities/test';

// 배정(StudySet) 전체 취소. 성공 시 배정에 속한 모든 시험이 함께 사라지므로
// 개별 키를 고르지 않고 student cascade 전체를 무효화한다
// (active 목록 · dashboard · todos · pending-reviews · clinic).
export function useCancelAssignment(studySetId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelAssignment(studySetId),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });
}

// 서버의 StudySet status(CREATED)를 클라이언트에서 파생한다 — active 응답에 status 필드가 없기 때문.
// 백엔드는 EXAMPLE(Sentence) 단계 통과 시 CREATED → WORD_COMP로 넘어가므로, 그 전까지만 취소 가능하다.
// 파생이 어긋나더라도 서버가 400 STUDY_SET_CANNOT_CANCEL로 막고 전역 AlertDialog가 이를 표시한다.
export function isAssignmentCancelable(steps: StepCardVM[]): boolean {
  const sentence = steps[1]; // STEP_NAMES 순서 고정: Word, Sentence, Review 1~3
  return !!sentence && sentence.status !== 'passed' && sentence.status !== 'skipped';
}
