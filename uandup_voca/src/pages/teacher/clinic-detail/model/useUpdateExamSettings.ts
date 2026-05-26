import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExamSettings, invalidateStudentCascade } from '@/entities/student';

export function useUpdateExamSettings(studentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof updateExamSettings>[1]) =>
      updateExamSettings(studentId, body),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });
}
