import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignWords, updateAssignmentCount, invalidateStudentCascade } from '@/entities/student';
import type { WordDifficultyLevel } from '@/entities/word';

interface AssignmentSettings {
  assignmentCount: number;
  level: WordDifficultyLevel;
}

export function useAssignmentActions(studentId: number) {
  const queryClient = useQueryClient();

  const assign = useMutation({
    mutationFn: () => assignWords(studentId),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });

  // Quick Assignment Card의 Apply 액션 — 배정 개수와 시작 레벨을 함께 갱신.
  // 서버 UpdateAssignmentCountRequest는 level이 optional이지만 UI에선 항상 두 값을 함께 다룬다.
  const updateSettings = useMutation({
    mutationFn: ({ assignmentCount, level }: AssignmentSettings) =>
      updateAssignmentCount(studentId, { assignmentCount, level }),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });

  return { assign, updateSettings };
}
