import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWord,
  updateWord,
  deleteWord,
  toWordCreateRequest,
  toWordUpdateRequest,
  wordKeys,
} from '@/entities/word';
import type { TeacherWord } from '@/entities/word';

type WordFormData = Omit<TeacherWord, 'id'>;

export function useWordActions() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: wordKeys.all });

  const create = useMutation({
    mutationFn: (data: WordFormData) => createWord(toWordCreateRequest(data)),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WordFormData }) =>
      updateWord(id, toWordUpdateRequest(data)),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteWord(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
