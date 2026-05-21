import { useState, useEffect } from 'react';

// useState와 동일한 인터페이스지만 값을 localStorage에 영속화한다.
// 페이지 이탈·새로고침·재방문 후에도 유지되어야 하는 UI 설정(예: 테이블 컬럼 표시 여부)에 사용한다.
//
// 초기값은 lazy initializer로 한 번만 읽는다. 파싱 실패(손상된 값, 스키마 변경)나
// localStorage 접근 불가(프라이빗 모드 등) 시에는 defaultValue로 안전하게 폴백한다.
export function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 저장 실패는 무시 — 영속화는 부가 기능이며 동작 자체를 막지 않는다.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
