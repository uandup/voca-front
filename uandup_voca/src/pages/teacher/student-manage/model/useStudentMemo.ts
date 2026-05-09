import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemos, createMemo, updateMemo, deleteMemo, toMemo } from '@/entities/memo';

export function useStudentMemo(studentId: number) {
  const queryClient = useQueryClient();
  const queryKey = ['students', studentId, 'memos'];

  const { data: memos, isLoading } = useQuery({
    queryKey,
    queryFn: () => getMemos(studentId),
    select: (res) => res.data?.map(toMemo) ?? [],
  });

  const addMutation = useMutation({
    mutationFn: ({ date, content }: { date: string; content: string }) =>
      createMemo(studentId, { date, content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const editMutation = useMutation({
    mutationFn: ({ memoId, date, content }: { memoId: number; date: string; content: string }) =>
      updateMemo(memoId, { date, content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (memoId: number) => deleteMemo(memoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    memos: memos ?? [],
    isLoading,
    add: addMutation.mutate,
    edit: editMutation.mutate,
    remove: removeMutation.mutate,
  };
}
