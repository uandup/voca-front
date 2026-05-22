import { getTokenPayload } from './utils';
import { useActiveChildId } from './useActiveChildId';

// 학생 페이지가 "지금 보고 있는 학생"의 studentId를 prop 없이 자가 해결하는 훅.
//
//  - STUDENT  : JWT의 sub이 곧 본인 studentId.
//  - PARENT   : 자녀 페이지를 읽기전용으로 공유하므로, 열람 중인 자녀 id를 반환.
//  - 그 외/토큰 없음 : null — 호출부가 빈 상태/redirect를 결정.
//
// 활성 자녀 id는 useActiveChildId로 구독하므로, 학부모가 자녀를 전환하면
// 같은 페이지에 머물러도 이 훅을 쓰는 컴포넌트가 새 자녀로 다시 그려진다.
export function useCurrentStudentId(): number | null {
  // 훅 규칙상 조건부 호출 불가 — role과 무관하게 항상 구독하고, 사용 여부만 분기한다.
  const activeChildId = useActiveChildId();
  const payload = getTokenPayload();
  if (!payload) return null;

  if (payload.role === 'STUDENT') {
    const id = Number(payload.sub);
    return Number.isFinite(id) ? id : null;
  }

  if (payload.role === 'PARENT') {
    return activeChildId;
  }

  return null;
}
