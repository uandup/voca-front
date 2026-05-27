import { useQuery } from '@tanstack/react-query';
import { getAssignedWords } from './studentApi';
import { toAssignedWordCardData } from '../model/mapper';
import { studentKeys } from './queryKeys';

// study-set 배정 단어 목록 + 예문 공개 여부.
// exampleVisible은 학생 화면의 예문 표시 토글에 쓰인다(선생님 화면은 항상 노출).
export function useAssignedWords(studySetId: number, enabled: boolean) {
  return useQuery({
    queryKey: studentKeys.studyWords(studySetId),
    queryFn: () => getAssignedWords(studySetId),
    select: (res) => ({
      exampleVisible: res.data?.exampleVisible ?? false,
      words: (res.data?.words ?? []).map(toAssignedWordCardData),
    }),
    enabled,
  });
}
