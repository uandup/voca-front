interface LoadingSpinnerProps {
  // 'block' = 영역 가운데에 큰 스피너 + 라벨 (페이지/모달 로딩에 사용).
  // 'inline' = 작은 스피너, 한 줄에 다른 콘텐츠와 함께 (버튼 안 등).
  variant?: 'block' | 'inline';
  // 'block'일 때 스피너 아래 표시할 텍스트.
  label?: string;
}

// 로딩 상태 표준 표시. 페이지·모달·테이블이 isLoading일 때 일관된 UI를 제공한다.
// "Loading..." 문자열 / 빈 fragment / null 같이 흩어져있던 패턴을 통일한다.
export function LoadingSpinner({ variant = 'block', label = 'Loading...' }: LoadingSpinnerProps) {
  if (variant === 'inline') {
    return (
      <span
        className="inline-block w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
        aria-label={label}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-on-surface-variant">
      <span className="inline-block w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
