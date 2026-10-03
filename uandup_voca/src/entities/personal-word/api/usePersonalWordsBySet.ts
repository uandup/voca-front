import { useQuery } from '@tanstack/react-query';
import { getPersonalWords } from './personalWordApi';
import { toPersonalWordCardData } from '../model/mapper';
import { personalWordKeys } from './queryKeys';

// 세트의 활성 단어 목록 — 서버가 등록순(createdAt ASC)으로 내려준다.
// 인자가 studentId가 아니라 personalWordSetId라는 점이 이름에 드러나야 한다: usePersonalWords(5)로는
// 5가 학생인지 세트인지 알 수 없어, 세트 전환 때 침묵의 버그가 된다.
export function usePersonalWordsBySet(personalWordSetId: number, enabled = true) {
  return useQuery({
    queryKey: personalWordKeys.bySet(personalWordSetId),
    queryFn: () => getPersonalWords(personalWordSetId),
    select: (res) => (res.data ?? []).map(toPersonalWordCardData),
    enabled: enabled && personalWordSetId > 0,
  });
}
