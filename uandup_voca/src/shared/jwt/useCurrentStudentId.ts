import { getTokenPayload } from './utils';

// 학생 페이지에서 본인의 studentId를 JWT에서 직접 추출하는 헬퍼.
// 페이지/훅이 prop으로 받지 않고도 본인 컨텍스트를 자가 해결할 수 있도록 한다.
// role !== 'STUDENT'이거나 토큰이 없으면 null — 호출부가 빈 상태/redirect를 결정.
export function useCurrentStudentId(): number | null {
  const payload = getTokenPayload();
  if (!payload || payload.role !== 'STUDENT') return null;
  const id = Number(payload.sub);
  return Number.isFinite(id) ? id : null;
}
