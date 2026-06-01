import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTeachers,
  updateTeacher,
  deleteTeacher,
  toTeacherManageRow,
  teacherKeys,
} from '@/entities/teacher';

export function useTeacherManage() {
  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery({
    queryKey: teacherKeys.list(),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherKeys.list() }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTeacher(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherKeys.list() }),
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
