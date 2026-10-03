import type { QueryClient } from '@tanstack/react-query';
import { personalWordKeys } from './queryKeys';
import { personalWordSetKeys } from '@/entities/personal-word-set/@x/personal-word';

interface PersonalWordCascadeTarget {
  // 세트 목록의 wordCount를 갱신하기 위해 필요하다.
  studentId: number;
  personalWordSetId: number;
}

/**
 * 단어 변경은 그 세트의 단어 목록 외에 **세트 목록의 wordCount**에도 영향을 준다.
 * 단어를 추가하고 목록으로 돌아갔을 때 개수가 그대로면 추가가 안 된 것처럼 보인다.
 */
export function invalidatePersonalWordCascade(
  qc: QueryClient,
  { studentId, personalWordSetId }: PersonalWordCascadeTarget,
) {
  qc.invalidateQueries({ queryKey: personalWordKeys.bySet(personalWordSetId) });
  qc.invalidateQueries({ queryKey: personalWordSetKeys.list(studentId) });
}
