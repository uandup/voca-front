import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPendingStudents,
  getPendingParents,
  getPendingTeachers,
  approveMember,
  rejectMember,
} from '@/entities/teacher';
import { toPendingStudent, toPendingTeacher, toPendingParent } from '../mapper';

export function usePendingStudents() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pending', 'students'],
    queryFn: getPendingStudents,
    select: (res) => res.data?.map(toPendingStudent) ?? [],
  });

  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
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
    queryKey: ['admin', 'pending', 'parents'],
    queryFn: getPendingParents,
    select: (res) => res.data?.map(toPendingParent) ?? [],
  });

  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
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
    queryKey: ['admin', 'pending', 'teachers'],
    queryFn: getPendingTeachers,
    select: (res) => res.data?.map(toPendingTeacher) ?? [],
  });

  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
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
    queryKey: ['admin', 'pending', 'students'],
    queryFn: getPendingStudents,
    select: (res) => res.data?.length ?? 0,
  });
  const { data: parents } = useQuery({
    queryKey: ['admin', 'pending', 'parents'],
    queryFn: getPendingParents,
    select: (res) => res.data?.length ?? 0,
  });
  const { data: teachers } = useQuery({
    queryKey: ['admin', 'pending', 'teachers'],
    queryFn: getPendingTeachers,
    select: (res) => res.data?.length ?? 0,
  });

  return {
    student: students ?? 0,
    parent: parents ?? 0,
    teacher: teachers ?? 0,
  };
}
