import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeachers, updateTeacher, deleteTeacher, toTeacherManageRow } from '@/entities/member';

export function useTeacherManage() {
  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['admin', 'manage', 'teachers'],
    queryFn: getTeachers,
    select: (res) => res.data?.map(toTeacherManageRow) ?? [],
  });

  const editMutation = useMutation({
    mutationFn: ({
      id,
      name,
      nameFirstEn,
      nameLastEn,
    }: {
      id: number;
      name: string;
      nameFirstEn: string;
      nameLastEn: string;
    }) => updateTeacher(id, { name, englishName: `${nameFirstEn} ${nameLastEn}`.trim() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'manage', 'teachers'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTeacher(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'manage', 'teachers'] }),
  });

  return {
    teachers: teachers ?? [],
    isLoading,
    isEditPending: editMutation.isPending,
    isDeletePending: deleteMutation.isPending,
    edit: editMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
