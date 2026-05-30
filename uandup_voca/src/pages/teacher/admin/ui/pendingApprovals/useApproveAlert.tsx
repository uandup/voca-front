import { useState } from 'react';
import type { ReactNode } from 'react';
import { AlertDialog } from '@/shared/ui/Modal';

/**
 * 승인 완료 AlertDialog 상태를 탭 레벨에서 관리하는 훅.
 *
 * 리스트 아이템 안의 ApproveRejectButtons에 state를 두면
 * 승인 → 캐시 무효화 → 아이템 언마운트 → state 소멸로 모달이 즉시 닫힌다.
 * 탭 컴포넌트에서 이 훅을 쓰고 `node`를 리스트 바깥에 렌더링해야 한다.
 *
 * @returns trigger — Approve 버튼과 함께 호출할 함수
 * @returns node    — 탭 컴포넌트 JSX 최상단에 렌더링할 AlertDialog 노드
 */
export function useApproveAlert(): { trigger: () => void; node: ReactNode } {
  const [open, setOpen] = useState(false);

  const trigger = () => setOpen(true);

  const node = open ? (
    <AlertDialog
      variant="success"
      title="Member Approved"
      description="The member now has full access to the platform."
      onClose={() => setOpen(false)}
    />
  ) : null;

  return { trigger, node };
}
