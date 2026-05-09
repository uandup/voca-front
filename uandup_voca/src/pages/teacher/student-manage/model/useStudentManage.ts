import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudents,
  updateStudent,
  deleteStudent,
  toStudentManageTableRow,
} from '@/entities/member';
import type { components } from '@/shared/api/schema.gen';

type StudentUpdateRequest = components['schemas']['StudentUpdateRequest'];

export function useStudentManage() {
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    select: (res) => res.data?.map(toStudentManageTableRow) ?? [],
  });

  const editMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: StudentUpdateRequest }) =>
      updateStudent(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  });

  return {
    students: students ?? [],
    isLoading,
    edit: editMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
