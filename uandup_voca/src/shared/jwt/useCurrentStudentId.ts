import { getTokenPayload } from './utils';
import { getActiveChildId } from './activeChild';

// 학생 페이지가 "지금 보고 있는 학생"의 studentId를 prop 없이 자가 해결하는 헬퍼.
//
//  - STUDENT  : JWT의 sub이 곧 본인 studentId.
//  - PARENT   : 자녀 페이지를 읽기전용으로 공유하므로, 열람 중인 자녀 id(localStorage)를 반환.
//  - 그 외/토큰 없음 : null — 호출부가 빈 상태/redirect를 결정.
//
// 학부모 자녀 전환은 페이지 네비게이션을 동반하므로 localStorage 동기 읽기로 충분하다
// (전환 시점에 자동 리렌더가 필요하지 않다).
export function useCurrentStudentId(): number | null {
  const payload = getTokenPayload();
  if (!payload) return null;

  if (payload.role === 'STUDENT') {
    const id = Number(payload.sub);
    return Number.isFinite(id) ? id : null;
  }

  if (payload.role === 'PARENT') {
    return getActiveChildId();
  }

  return null;
}
