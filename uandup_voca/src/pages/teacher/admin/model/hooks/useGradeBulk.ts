import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { promoteAllStudentsGrade, demoteAllStudentsGrade } from '@/entities/teacher';

export interface GradeBulkResult {
  updated: number;
  skipped: number;
}

export function useGradeBulk() {
  const [result, setResult] = useState<GradeBulkResult | null>(null);

  const promote = useMutation({
    mutationFn: promoteAllStudentsGrade,
    onSuccess: (res) =>
      setResult({ updated: res.data?.updated ?? 0, skipped: res.data?.skipped ?? 0 }),
  });

  const demote = useMutation({
    mutationFn: demoteAllStudentsGrade,
    onSuccess: (res) =>
      setResult({ updated: res.data?.updated ?? 0, skipped: res.data?.skipped ?? 0 }),
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
