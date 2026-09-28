import type { ReactNode } from 'react';

interface Props {
  title: string;
  // 뒤로가기 동작. 없으면 화살표를 그리지 않는다 (탭 최상위 화면).
  onBack?: () => void;
  // 제목 아래 보조 설명 (예: "30 words").
  subtitle?: string;
  // 우측 액션 슬롯.
  action?: ReactNode;
}

/**
 * 모바일 화면 상단 제목 줄.
 *
 * shared/ui의 PageTitle·BreadcrumbPageTitle을 쓰지 않는 이유: 둘 다 text-4xl(36px)이
 * 하드코딩이고 BreadcrumbPageTitle은 40px 쉐브론까지 쓴다 — 360px 폭에서 넘친다.
 * 그 둘은 /student와 /teacher가 함께 쓰므로 수정하면 blast radius가 앱 전체다.
 * 그래서 고치지 않고 모바일 전용 대체물을 둔다.
 */
export function MobileScreenHeader({ title, onBack, subtitle, action }: Props) {
  return (
    <header className="flex items-center gap-2 mb-4">
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Go back"
          className="-ml-2 w-11 h-11 flex items-center justify-center shrink-0 rounded-xl text-on-surface-variant touch-manipulation"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            arrow_back
          </span>
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="font-headline text-xl font-extrabold text-primary truncate">{title}</h1>
        {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
