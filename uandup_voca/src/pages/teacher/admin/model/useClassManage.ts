import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  toClassListItem,
} from '@/entities/class';

export function useClassManage() {
  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useQuery({
    queryKey: ['admin', 'classrooms'],
    queryFn: getClassrooms,
    select: (res) => res.data?.map(toClassListItem) ?? [],
  });

  const addMutation = useMutation({
    mutationFn: (name: string) => createClassroom({ name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'classrooms'] }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateClassroom(id, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'classrooms'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteClassroom(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'classrooms'] }),
  });

  return {
    classList: classes ?? [],
    isLoading,
    isAddPending: addMutation.isPending,
    isDeletePending: deleteMutation.isPending,
    add: addMutation.mutate,
    edit: editMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
