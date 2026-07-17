import { useQuery } from '@tanstack/react-query';
import { getSubmittedExams } from './gradingQueueApi';
import { toGradingQueueItem } from '../model/mapper';
import { gradingQueueKeys } from './queryKeys';

// 채점 대기 큐 조회. 갱신 시점은 "새로고침 버튼 또는 화면 재진입" 두 가지로 한정한다.
//  - staleTime: 0  → 전역 기본값(60s)을 덮어 매 mount(=페이지 재진입)마다 최신 스냅샷을 받는다.
//  - refetchOnWindowFocus: false → 전역 기본값(true)을 덮어, 선생님이 다른 창을 보다 돌아올 때
//    목록이 조용히 재정렬되는 것을 막는다(읽는 중 항목이 움직이면 혼란).
// dataUpdatedAt은 실제 마지막 fetch 시점이라 "Last updated" 라벨에 그대로 쓴다.
export function useSubmittedExams() {
  return useQuery({
    queryKey: gradingQueueKeys.list(),
    queryFn: getSubmittedExams,
    select: (res) => (res.data ?? []).map(toGradingQueueItem),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
