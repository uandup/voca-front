import type { QueryClient } from '@tanstack/react-query';
import { personalWordSetKeys } from './queryKeys';
import { personalWordKeys } from '@/entities/personal-word/@x/personal-word-set';

/**
 * 세트 변경은 단어 목록에도 영향을 준다.
 * - 삭제: 서버가 소속 단어까지 함께 소프트 삭제하므로 그 세트의 단어 캐시가 stale해진다
 * - 생성·이름변경: 단어는 그대로지만, 세트 하나만 골라 무효화할 근거가 없어 personalWordKeys.all로 쓸어낸다
 *   (세트 수가 많지 않고, 단어 목록은 세트 상세에 들어갈 때만 쓰이므로 과도한 비용이 아니다)
 */
export function invalidatePersonalWordSetCascade(qc: QueryClient, studentId: number) {
  qc.invalidateQueries({ queryKey: personalWordSetKeys.list(studentId) });
  qc.invalidateQueries({ queryKey: personalWordKeys.all });
}
