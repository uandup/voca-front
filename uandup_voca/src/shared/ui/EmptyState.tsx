import type { ReactNode } from 'react';

interface EmptyStateProps {
  // Material Symbols 아이콘 이름 (선택). 'inbox', 'search_off', 'assignment' 등.
  icon?: string;
  // 큰 글자 메시지.
  title: string;
  // 보조 설명 (선택).
  description?: string;
  // 우측·하단에 표시할 액션 버튼 (선택).
  action?: ReactNode;
}

// "데이터 없음" 상태를 표시할 때 쓰는 표준 컴포넌트.
// 테이블 / 리스트 / 모달 어디서나 일관된 빈 화면 UI를 제공한다.
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {icon && (
        <span
          className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-1"
          aria-hidden
        >
          {icon}
        </span>
      )}
      <p className="text-sm font-bold text-on-surface">{title}</p>
      {description && <p className="text-xs text-on-surface-variant">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
