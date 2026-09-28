import { useSyncExternalStore } from 'react';

// 홈 화면 설치(PWA) 가능 여부와 설치 실행을 다루는 훅.
// 비즈니스를 모르는 브라우저 관심사라 shared에 둔다.

// beforeinstallprompt는 표준 DOM 타입에 없어 직접 선언한다.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/**
 * beforeinstallprompt 이벤트를 붙잡아 두기 시작한다. **main.tsx에서 앱 렌더 전에 호출해야 한다.**
 *
 * 크롬은 페이지 로드 직후 이 이벤트를 한 번 쏘고 만다. 리스너를 설치 버튼이 있는 화면
 * (/m/account) 안에 두면, 그 화면이 lazy 로딩되기 전에 이벤트가 지나가버려 영영 못 잡는다.
 * 그래서 초기 번들에서 가장 먼저 등록한다.
 */
export function initInstallPromptCapture() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  window.addEventListener('beforeinstallprompt', (e) => {
    // 크롬이 자체 미니 배너를 띄우는 것을 막고, 우리가 고른 자리(/m/account)에서 유도한다.
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    emit();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return deferredPrompt;
}

// 이미 홈 화면 앱으로 실행 중인가. iOS는 display-mode를 안 쓰고 navigator.standalone을 쓴다.
function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// iOS 사파리는 beforeinstallprompt를 지원하지 않는다 —
// 사용자가 "공유 → 홈 화면에 추가"를 직접 눌러야 하므로 안내 문구로 대체해야 한다.
function detectIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  // iPadOS 13+는 데스크탑 사파리처럼 Macintosh로 보고하므로 터치 지원 여부로 걸러낸다.
  const iPadOS = /Macintosh/.test(ua) && window.navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || iPadOS;
}

export function useInstallPrompt() {
  const prompt = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const isStandalone = detectStandalone();

  async function install(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!deferredPrompt) return 'unavailable';
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    // 프롬프트는 한 번만 쓸 수 있다 — 결과와 무관하게 버린다.
    deferredPrompt = null;
    emit();
    return outcome;
  }

  return {
    // 설치 버튼을 눌러 바로 설치할 수 있는 상태 (안드로이드/데스크탑 크롬·엣지).
    canInstall: prompt !== null && !isStandalone,
    // iOS라서 수동 안내가 필요한 상태.
    needsManualInstall: detectIOS() && !isStandalone,
    isStandalone,
    install,
  };
}
