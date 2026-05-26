import { useState, useCallback } from 'react';
import type { StudentPickerRow } from '@/entities/student';

// 학부모 승인 화면의 자녀 매칭 상태를 관리하는 훅.
// 한 학부모에 여러 자녀를 매칭할 수 있어 값은 배열이며, 승인 시 이 학생 id들이 ApproveRequest body에 담긴다.
// 상태 자체는 PendingApprovalsModal이 소유하되 ParentTab·StudentMatchPanel이 공유하므로,
// 매칭 관련 로직을 이 훅으로 모아 모달 컴포넌트에서 학부모 전용 로직을 덜어낸다.
export function useChildMatching() {
  const [matchedChildren, setMatchedChildren] = useState<Map<number, StudentPickerRow[]>>(
    new Map(),
  );

  // 같은 학생을 다시 선택해도 id 기준으로 중복은 무시한다.
  const addChild = useCallback((parentId: number, student: StudentPickerRow) => {
    setMatchedChildren((prev) => {
      const current = prev.get(parentId) ?? [];
      if (current.some((s) => s.id === student.id)) return prev;
      return new Map(prev).set(parentId, [...current, student]);
    });
  }, []);

  const removeChild = useCallback((parentId: number, studentId: number) => {
    setMatchedChildren((prev) => {
      const current = prev.get(parentId) ?? [];
      const next = new Map(prev);
      const remaining = current.filter((s) => s.id !== studentId);
      if (remaining.length > 0) next.set(parentId, remaining);
      else next.delete(parentId);
      return next;
    });
  }, []);

  // 특정 학부모에 매칭된 학생 id 집합 — 매칭 패널의 '추가됨' 표시에 쓴다.
  const getSelectedIds = useCallback(
    (parentId: number) => new Set((matchedChildren.get(parentId) ?? []).map((s) => s.id)),
    [matchedChildren],
  );

  return { matchedChildren, addChild, removeChild, getSelectedIds };
}
