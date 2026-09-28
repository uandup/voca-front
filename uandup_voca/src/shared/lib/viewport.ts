// 화면 폭으로 모바일 여부를 판정하고, 사용자가 명시적으로 고른 뷰 모드를 보관한다.
// 비즈니스를 전혀 모르는 브라우저 관심사라 shared에 둔다 (matchMedia + localStorage만 사용).

// 768px = Tailwind의 md 브레이크포인트. 미만이면 폰으로 본다.
// 아이패드 세로(768px)는 "모바일 아님"으로 남겨 기존 /student 화면을 그대로 쓰게 한다 —
// /student 레이아웃이 이미 1280px 미만을 태블릿으로 처리하고 있어 그 아래에 자연스럽게 이어진다.
export const MOBILE_MQ = '(max-width: 767px)';

const VIEW_MODE_KEY = 'voca:viewMode';

export type ViewPreference = 'mobile' | 'desktop';

export function isMobileViewport(): boolean {
  return window.matchMedia(MOBILE_MQ).matches;
}

/**
 * 사용자가 직접 고른 뷰 모드. null이면 "고른 적 없음" → 화면 폭으로 판정한다.
 *
 * 이 선호도가 존재하는 이유는 **데스크탑 사용자가 모바일 뷰에 갇히는 것을 막기 위해서**다.
 * 노트북에서 창을 좁게 쓰면 768px 미만이 되어 /m으로 튕기는데, /m은 반대 방향으로
 * 자동 리다이렉트하지 않으므로(무한 루프 방지) 빠져나올 수단이 따로 필요하다.
 */
export function getViewPreference(): ViewPreference | null {
  try {
    const raw = localStorage.getItem(VIEW_MODE_KEY);
    return raw === 'mobile' || raw === 'desktop' ? raw : null;
  } catch {
    // 시크릿 모드 등 localStorage 접근이 막힌 환경 — 선호도 없음으로 취급한다.
    return null;
  }
}

// null을 넘기면 선호도를 지워 다시 화면 폭 판정으로 되돌린다.
export function setViewPreference(value: ViewPreference | null): void {
  try {
    if (value === null) localStorage.removeItem(VIEW_MODE_KEY);
    else localStorage.setItem(VIEW_MODE_KEY, value);
  } catch {
    // 저장 실패는 무시한다 — 선호도는 편의 기능이고, 없으면 폭 판정으로 동작한다.
  }
}

/**
 * 지금 모바일 화면(/m)으로 보내야 하는가.
 *
 * 라우트의 beforeLoad에서만 호출한다 = **내비게이션 시점에만 판정**한다.
 * resize/회전 이벤트를 구독해 강제 이동시키지 않는 것은 의도된 설계다 —
 * 데스크탑 사용자가 창 크기를 바꾸는 도중에 화면이 튀지 않아야 한다.
 */
export function shouldRedirectToMobile(): boolean {
  const pref = getViewPreference();
  // 명시적 선택이 항상 폭 판정을 이긴다.
  if (pref === 'desktop') return false;
  if (pref === 'mobile') return true;
  return isMobileViewport();
}
