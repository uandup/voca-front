import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import {
  getPendingStudents,
  getPendingParents,
  getPendingTeachers,
  approveMember,
  rejectMember,
  adminKeys,
  teacherKeys,
} from '@/entities/teacher';
import { studentKeys } from '@/entities/student';
import { parentKeys } from '@/entities/parent';
import { toPendingStudent, toPendingTeacher, toPendingParent } from '../mapper';

// 승인/거절 후 갱신해야 하는 공통 쿼리:
//   - adminKeys.pending()      : 승인 대기 목록(학생·학부모·선생님 탭)
//   - adminKeys.pendingCount() : AdminPage 대시보드의 대기 카운트.
//     pending()의 자식이 아니라 형제 키라서 pending() invalidate에 잡히지 않으므로 별도로 무효화한다.
// listKey는 승인 대상 역할의 실제 멤버 목록(학생/학부모/선생님)으로, 승인 시 그 목록에 새 멤버가 들어간다.
function invalidateAfterApproval(queryClient: QueryClient, listKey: QueryKey) {
  queryClient.invalidateQueries({ queryKey: adminKeys.pending() });
  queryClient.invalidateQueries({ queryKey: adminKeys.pendingCount() });
  queryClient.invalidateQueries({ queryKey: listKey });
}

export function usePendingStudents() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: adminKeys.pendingStudents(),
    queryFn: getPendingStudents,
    select: (res) => res.data?.map(toPendingStudent) ?? [],
  });

  const onSettled = () => invalidateAfterApproval(queryClient, studentKeys.lists());
  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: onSettled,
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: onSettled,
  });

  return {
    list: data ?? [],
    isLoading,
    approve: approve.mutate,
    reject: reject.mutate,
  };
}

export function usePendingParents() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: adminKeys.pendingParents(),
    queryFn: getPendingParents,
    select: (res) => res.data?.map(toPendingParent) ?? [],
  });

  const onSettled = () => invalidateAfterApproval(queryClient, parentKeys.list());
  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: onSettled,
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: onSettled,
  });

  return {
    list: data ?? [],
    isLoading,
    approve: approve.mutate,
    reject: reject.mutate,
  };
}

export function usePendingTeachers() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: adminKeys.pendingTeachers(),
    queryFn: getPendingTeachers,
    select: (res) => res.data?.map(toPendingTeacher) ?? [],
  });

  const onSettled = () => invalidateAfterApproval(queryClient, teacherKeys.list());
  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: onSettled,
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: onSettled,
  });

  return {
    list: data ?? [],
    isLoading,
    approve: approve.mutate,
    reject: reject.mutate,
  };
}

export function usePendingCounts() {
  const { data: students } = useQuery({
    queryKey: adminKeys.pendingStudents(),
    queryFn: getPendingStudents,
    select: (res) => res.data?.length ?? 0,
  });
  const { data: parents } = useQuery({
    queryKey: adminKeys.pendingParents(),
    queryFn: getPendingParents,
    select: (res) => res.data?.length ?? 0,
  });
  const { data: teachers } = useQuery({
    queryKey: adminKeys.pendingTeachers(),
    queryFn: getPendingTeachers,
    select: (res) => res.data?.length ?? 0,
  });

  return {
    student: students ?? 0,
    parent: parents ?? 0,
    teacher: teachers ?? 0,
  };
}
