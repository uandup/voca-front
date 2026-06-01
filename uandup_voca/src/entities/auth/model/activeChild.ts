// 학부모가 열람 중인 자녀(student)의 id를 localStorage에 보관한다.
//
// 학생은 JWT의 sub이 곧 본인 studentId라 별도 저장이 필요 없지만,
// 학부모는 JWT sub이 본인(parent) id이므로 "지금 보고 있는 자녀"를 따로 들고 있어야 한다.
// localStorage에 두는 이유 — axios 인터셉터처럼 React 밖에서도 동기적으로 읽어야 하기 때문.
//
// 이 값은 "마지막으로 본 자녀"로도 쓰인다: 401 만료 후 토큰만 사라지고 이 키는 남으므로,
// 재로그인 시 PendingPage가 이 값으로 직전 자녀를 복원한다. 명시적 로그아웃에서만 제거된다.
//
// localStorage는 React가 변경을 감지하지 못하므로, set/clear 시 구독자에게 직접 알린다.
// useActiveChildId(useSyncExternalStore 기반)가 이 구독을 통해 전환 즉시 리렌더된다.
const ACTIVE_CHILD_KEY = 'parent:activeChildId';

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((l) => l());
}

// useSyncExternalStore의 subscribe 인자 — 구독 등록 후 해제 함수를 반환한다.
export function subscribeActiveChildId(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getActiveChildId(): number | null {
  const raw = localStorage.getItem(ACTIVE_CHILD_KEY);
  if (raw === null) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function setActiveChildId(studentId: number): void {
  localStorage.setItem(ACTIVE_CHILD_KEY, String(studentId));
  notify();
}

export function clearActiveChildId(): void {
  localStorage.removeItem(ACTIVE_CHILD_KEY);
  notify();
}
