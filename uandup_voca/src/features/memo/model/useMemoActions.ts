import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemos, createMemo, updateMemo, deleteMemo, toMemo } from '@/entities/memo';

export function useMemoActions(studentId: number, onMutationSuccess?: () => void) {
  const queryClient = useQueryClient();
  const queryKey = ['students', studentId, 'memos'];

  const { data: memos, isLoading } = useQuery({
    queryKey,
    queryFn: () => getMemos(studentId),
    select: (res) => res.data?.map(toMemo) ?? [],
  });

  function handleSuccess() {
    queryClient.invalidateQueries({ queryKey });
    onMutationSuccess?.();
  }

  const addMutation = useMutation({
    mutationFn: ({ date, content }: { date: string; content: string }) =>
      createMemo(studentId, { date, content }),
    onSuccess: handleSuccess,
  });

  const editMutation = useMutation({
    mutationFn: ({ memoId, date, content }: { memoId: number; date: string; content: string }) =>
      updateMemo(memoId, { date, content }),
    onSuccess: handleSuccess,
  });

  const removeMutation = useMutation({
    mutationFn: (memoId: number) => deleteMemo(memoId),
    onSuccess: handleSuccess,
  });

  return {
    memos: memos ?? [],
    isLoading,
    add: addMutation.mutate,
    edit: editMutation.mutate,
    remove: removeMutation.mutate,
  };
}
