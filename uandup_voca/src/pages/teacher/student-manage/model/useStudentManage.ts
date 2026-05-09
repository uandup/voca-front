import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudents,
  updateStudent,
  deleteStudent,
  toStudentManageTableRow,
  toStudentUpdateRequest,
} from '@/entities/member';
import type { StudentDetail } from '@/entities/member';

export function useStudentManage() {
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    select: (res) => res.data?.map(toStudentManageTableRow) ?? [],
  });

  const editMutation = useMutation({
    mutationFn: (detail: StudentDetail) => updateStudent(detail.id, toStudentUpdateRequest(detail)),
    onSuccess: (_, detail) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', detail.id, 'detail'] });
    },
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
