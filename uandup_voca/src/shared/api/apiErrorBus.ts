// 뮤테이션 에러 메시지를 QueryProvider로 전달하는 단순 이벤트 버스.
//
// MutationCache.onError는 React 렌더 사이클 밖(싱글톤 생성 시점)에서 등록되므로
// React state를 직접 업데이트할 수 없다. 콜백 Set을 통해 간접적으로 전달한다.
//
// 사용 패턴:
//   emit      — MutationCache.onError에서 에러 메시지를 발행
//   subscribe — QueryProvider에서 구독해 AlertDialog를 띄운다

type Listener = (message: string) => void;

const listeners = new Set<Listener>();

export const apiErrorBus = {
  emit: (message: string) => listeners.forEach((l) => l(message)),
  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
