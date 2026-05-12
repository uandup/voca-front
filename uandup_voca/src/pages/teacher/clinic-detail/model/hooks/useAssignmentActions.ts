import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignWords, updateAssignmentCount, invalidateStudentCascade } from '@/entities/student';

export function useAssignmentActions(studentId: number) {
  const queryClient = useQueryClient();

  const assign = useMutation({
    mutationFn: () => assignWords(studentId),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });

  const updateCount = useMutation({
    mutationFn: (count: number) => updateAssignmentCount(studentId, { assignmentCount: count }),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });

  return { assign, updateCount };
}
