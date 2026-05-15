import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudents,
  updateStudent,
  deleteStudent,
  toStudentManageTableRow,
  toStudentUpdateRequest,
  studentKeys,
  invalidateStudentCascade,
} from '@/entities/student';
import type { StudentDetail } from '@/entities/student';

export function useStudentManage() {
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: studentKeys.lists(),
    queryFn: getStudents,
    select: (res) => res.data?.map(toStudentManageTableRow) ?? [],
  });

  const editMutation = useMutation({
    mutationFn: (detail: StudentDetail) => updateStudent(detail.id, toStudentUpdateRequest(detail)),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => invalidateStudentCascade(queryClient),
  });

  return {
    students: students ?? [],
    isLoading,
    edit: editMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
