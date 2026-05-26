import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { promoteAllStudentsGrade, demoteAllStudentsGrade } from '@/entities/teacher';
import { invalidateStudentCascade } from '@/entities/student';

export interface GradeBulkResult {
  updated: number;
  skipped: number;
}

export function useGradeBulk() {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<GradeBulkResult | null>(null);

  const handleSuccess = (res: { data?: { updated?: number; skipped?: number } }) => {
    setResult({ updated: res.data?.updated ?? 0, skipped: res.data?.skipped ?? 0 });
    invalidateStudentCascade(queryClient);
  };

  const promote = useMutation({
    mutationFn: promoteAllStudentsGrade,
    onSuccess: handleSuccess,
  });

  const demote = useMutation({
    mutationFn: demoteAllStudentsGrade,
    onSuccess: handleSuccess,
  });

  function apply(delta: 1 | -1) {
    setResult(null);
    if (delta === 1) promote.mutate();
    else demote.mutate();
  }

  return {
    result,
    isPending: promote.isPending || demote.isPending,
    apply,
  };
}
