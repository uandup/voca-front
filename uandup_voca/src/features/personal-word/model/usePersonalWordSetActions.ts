import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPersonalWordSet,
  updatePersonalWordSet,
  deletePersonalWordSet,
  toPersonalWordSetCreateRequest,
  toPersonalWordSetUpdateRequest,
  invalidatePersonalWordSetCascade,
} from '@/entities/personal-word-set';
import type { PersonalWordSetFormData } from '@/entities/personal-word-set';

// 개인 단어 세트 CRUD mutation 묶음.
// 세트 삭제는 서버가 소속 단어까지 소프트 삭제하므로 단어 캐시도 함께 무효화된다
// (invalidatePersonalWordSetCascade가 처리).
export function usePersonalWordSetActions(studentId: number) {
  const queryClient = useQueryClient();

  const invalidate = () => invalidatePersonalWordSetCascade(queryClient, studentId);

  const create = useMutation({
    mutationFn: (data: PersonalWordSetFormData) =>
      createPersonalWordSet(studentId, toPersonalWordSetCreateRequest(data)),
    onSuccess: invalidate,
  });

  const rename = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PersonalWordSetFormData }) =>
      updatePersonalWordSet(id, toPersonalWordSetUpdateRequest(data)),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => deletePersonalWordSet(id),
    onSuccess: invalidate,
  });

  return { create, rename, remove };
}
