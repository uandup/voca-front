import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPersonalWords,
  updatePersonalWord,
  deletePersonalWord,
  toPersonalWordBulkCreateRequest,
  toPersonalWordUpdateRequest,
  invalidatePersonalWordCascade,
} from '@/entities/personal-word';
import type { PersonalWordCardData } from '@/entities/personal-word';

type PersonalWordFormData = Omit<PersonalWordCardData, 'id'>;

interface UsePersonalWordActionsParams {
  // 세트 목록의 wordCount를 함께 갱신하려면 학생도 알아야 한다.
  studentId: number;
  personalWordSetId: number;
}

// personal-word CRUD mutation 묶음.
// 단어 변경이 personal-word 캐시와 personal-word-set 캐시(wordCount) 둘을 건드리므로
// page가 아니라 features에 둔다 — 학생 세트상세와 교사 관리페이지 두 곳이 같이 쓴다.
export function usePersonalWordActions({
  studentId,
  personalWordSetId,
}: UsePersonalWordActionsParams) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    invalidatePersonalWordCascade(queryClient, { studentId, personalWordSetId });

  // 서버에 단건 등록 엔드포인트가 없다 — 한 개든 여러 개든 이 mutation을 쓴다.
  const createMany = useMutation({
    mutationFn: (items: PersonalWordFormData[]) =>
      createPersonalWords(personalWordSetId, toPersonalWordBulkCreateRequest(items)),
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

  return { createMany, update, remove };
}
