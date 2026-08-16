import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPersonalWord,
  updatePersonalWord,
  deletePersonalWord,
  toPersonalWordCreateRequest,
  toPersonalWordUpdateRequest,
  personalWordKeys,
} from '@/entities/personal-word';
import type { PersonalWordCardData } from '@/entities/personal-word';

type PersonalWordFormData = Omit<PersonalWordCardData, 'id'>;

// personal-word 도메인 CRUD mutation 묶음 — useWordActions.ts(vocabulary-bank)와 동일하게
// page-scoped로 둔다. personal-word 캐시는 학생별로 나뉘어 있어 studentId로 invalidate한다.
export function usePersonalWordActions(studentId: number) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: personalWordKeys.list(studentId) });

  const create = useMutation({
    mutationFn: (data: PersonalWordFormData) =>
      createPersonalWord(studentId, toPersonalWordCreateRequest(data)),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PersonalWordFormData }) =>
      updatePersonalWord(id, toPersonalWordUpdateRequest(data)),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => deletePersonalWord(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
