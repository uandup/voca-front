import { useSyncExternalStore } from 'react';
import { getActiveChildId, subscribeActiveChildId } from './activeChild';

// localStorage의 활성 자녀 id를 React 상태처럼 구독하는 훅.
// setActiveChildId/clearActiveChildId 호출 시 이 훅을 쓰는 모든 컴포넌트가 즉시 리렌더된다.
// getSnapshot은 number | null(원시값)을 반환하므로 동일 id면 참조가 같아 안전하다.
export function useActiveChildId(): number | null {
  return useSyncExternalStore(subscribeActiveChildId, getActiveChildId);
}
