import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNonAdminTeachers,
  getAdminTeachers,
  promoteTeacherToAdmin,
  demoteAdminToTeacher,
  toTeacherRow,
  teacherKeys,
} from '@/entities/teacher';
import { getTokenPayload } from '@/shared/jwt';

export function useTeacherPermission() {
  const queryClient = useQueryClient();

  const { data: teachers, isLoading: loadingTeachers } = useQuery({
    queryKey: teacherKeys.nonAdmins(),
    queryFn: getNonAdminTeachers,
    select: (res) => res.data?.map(toTeacherRow) ?? [],
  });

  const { data: admins, isLoading: loadingAdmins } = useQuery({
    queryKey: teacherKeys.admins(),
    queryFn: getAdminTeachers,
    select: (res) => res.data?.map(toTeacherRow) ?? [],
  });

  const promote = useMutation({
    mutationFn: (id: number) => promoteTeacherToAdmin(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherKeys.all }),
  });

  const demote = useMutation({
    mutationFn: (id: number) => demoteAdminToTeacher(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherKeys.all }),
  });

  const currentUserId = Number(getTokenPayload()?.sub ?? -1);

  return {
    teachers: teachers ?? [],
    admins: admins ?? [],
    loadingTeachers,
    loadingAdmins,
    isPending: promote.isPending || demote.isPending,
    currentUserId,
    promote: promote.mutate,
    demote: demote.mutate,
  };
}
