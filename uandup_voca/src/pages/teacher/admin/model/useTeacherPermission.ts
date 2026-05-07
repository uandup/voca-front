import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNonAdminTeachers,
  getAdminTeachers,
  promoteTeacherToAdmin,
  demoteAdminToTeacher,
  toTeacherRow,
} from '@/entities/member';

export function useTeacherPermission() {
  const queryClient = useQueryClient();

  const { data: teachers, isLoading: loadingTeachers } = useQuery({
    queryKey: ['admin', 'teachers', 'non-admins'],
    queryFn: getNonAdminTeachers,
    select: (res) => res.data?.map(toTeacherRow) ?? [],
  });

  const { data: admins, isLoading: loadingAdmins } = useQuery({
    queryKey: ['admin', 'teachers', 'admins'],
    queryFn: getAdminTeachers,
    select: (res) => res.data?.map(toTeacherRow) ?? [],
  });

  const promote = useMutation({
    mutationFn: (id: number) => promoteTeacherToAdmin(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] }),
  });

  const demote = useMutation({
    mutationFn: (id: number) => demoteAdminToTeacher(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] }),
  });

  return {
    teachers: teachers ?? [],
    admins: admins ?? [],
    loadingTeachers,
    loadingAdmins,
    isPending: promote.isPending || demote.isPending,
    promote: promote.mutate,
    demote: demote.mutate,
  };
}
