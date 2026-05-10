import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getParents, updateParent, deleteParent, toParentManageRow } from '@/entities/parent';

export function useParentManage() {
  const queryClient = useQueryClient();

  const { data: parents, isLoading } = useQuery({
    queryKey: ['admin', 'manage', 'parents'],
    queryFn: getParents,
    select: (res) => res.data?.map(toParentManageRow) ?? [],
  });

  const editMutation = useMutation({
    mutationFn: ({ id, name, phoneNumber }: { id: number; name: string; phoneNumber: string }) =>
      updateParent(id, { name, phoneNumber }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'manage', 'parents'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteParent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'manage', 'parents'] }),
  });

  return {
    parents: parents ?? [],
    isLoading,
    isEditPending: editMutation.isPending,
    isDeletePending: deleteMutation.isPending,
    edit: editMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
