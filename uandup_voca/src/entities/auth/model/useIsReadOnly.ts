import { getTokenPayload } from './jwt';

// 현재 세션이 읽기전용인지 — 학부모가 자녀 페이지를 공유 열람하는 경우 true.
//
// 학부모는 학생과 동일한 페이지를 보지만 시험 응시·답안 제출 같은 행위는 금지된다.
// 학생 페이지의 액션 버튼/폼은 이 값으로 비활성화하거나 가드한다.
export function useIsReadOnly(): boolean {
  return getTokenPayload()?.role === 'PARENT';
}
