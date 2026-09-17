import type { ReactNode } from 'react';

// 가릴 수 있는 영역. 클릭하면 그 영역만 공개되고, 다시 클릭하면 도로 가려진다.
//
// 내용을 빼고 바로 치환하는 대신 **자리는 그대로 두고 visibility로 감춘 뒤 위를 덮는다.**
// 가림/공개 사이에 영역 크기가 변하지 않아야 공개할 때 카드 높이가 바뀌지 않고,
// 목록에서 한 장을 열 때 아래 카드들이 밀리지 않는다.
//
// visibility:hidden이라 감춰진 동안에는 드래그 선택·탭 포커스·스크린리더에도 잡히지 않는다
// (DOM에는 남아 있으므로 개발자도구로는 볼 수 있지만, 학습 보조 기능이라 그 수준으로 충분하다).
export function Maskable({
  hidden,
  // 마스크 토글이 켜져 있는가. 공개 상태에서도 다시 눌러 가릴 수 있게 클릭 영역을 유지한다.
  enabled,
  label,
  onClick,
  children,
}: {
  hidden: boolean;
  enabled: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <div className={hidden ? 'invisible' : ''}>{children}</div>
      {enabled && (
        <button
          onClick={onClick}
          aria-label={label}
          className={`absolute inset-0 rounded-lg transition-colors ${
            hidden ? 'bg-surface-container-highest hover:bg-surface-container-high' : ''
          }`}
        />
      )}
    </div>
  );
}
