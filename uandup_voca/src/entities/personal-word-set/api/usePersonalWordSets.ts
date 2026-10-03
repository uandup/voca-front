import { useQuery } from '@tanstack/react-query';
import { getPersonalWordSets } from './personalWordSetApi';
import { toPersonalWordSetRow } from '../model/mapper';
import { personalWordSetKeys } from './queryKeys';

// 학생의 활성 세트 목록 — 서버가 등록순으로 내려주므로 클라이언트에서 재정렬하지 않는다.
// 각 행의 wordCount도 서버 집계값이라 세트별 단어 조회가 따로 필요 없다.
export function usePersonalWordSets(studentId: number, enabled = true) {
  return useQuery({
    queryKey: personalWordSetKeys.list(studentId),
    queryFn: () => getPersonalWordSets(studentId),
    select: (res) => (res.data ?? []).map(toPersonalWordSetRow),
    enabled: enabled && studentId > 0,
  });
}
