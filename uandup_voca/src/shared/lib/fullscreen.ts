// 전체화면(Fullscreen) API 래퍼 — Safari 구버전 webkit 프리픽스까지 커버한다.
// 비즈니스를 모르는 generic 인프라라 shared에 둔다.

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
  webkitFullscreenEnabled?: boolean;
};
type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => void;
};

/**
 * 브라우저가 (영상이 아닌) 일반 요소의 전체화면을 지원한다고 "주장"하는지.
 *
 * ⚠️ 이 값을 신뢰하지 마세요. iPad Safari는 이 플래그가 true로 오면서도 실제
 * requestFullscreen은 실패합니다. 진입 성공 여부는 requestFullscreenVerified의
 * 반환값으로 판단해야 합니다.
 */
export function isFullscreenSupported(): boolean {
  const d = document as FullscreenDocument;
  return Boolean(document.fullscreenEnabled ?? d.webkitFullscreenEnabled);
}

export function getFullscreenElement(): Element | null {
  const d = document as FullscreenDocument;
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}

/**
 * 전체화면 진입을 시도하고 "실제로 진입했는지"를 반환한다.
 *
 * fullscreenEnabled가 true여도 진입이 실패하는 기기(iPad 등)가 있어, 플래그가 아니라
 * 진입 결과로 판단해야 한다. 호출처는 false를 받으면 전체화면에 의존하는 UI(가림막)를
 * 걷어내 사용자가 갇히지 않게 해야 한다.
 *
 * 브라우저 정책상 사용자 제스처(클릭) 핸들러 안에서만 성공하므로 버튼 onClick에서 호출한다.
 */
export async function requestFullscreenVerified(): Promise<boolean> {
  const el = document.documentElement as FullscreenElement;
  const fn = el.requestFullscreen ?? el.webkitRequestFullscreen;
  if (!fn) return false;

  try {
    // 표준 API는 Promise를 반환하지만 webkit 프리픽스 버전은 반환하지 않는다(await undefined는 무해).
    await fn.call(el);
  } catch {
    return false;
  }

  if (getFullscreenElement() !== null) return true;

  // webkit 경로는 동기 반환이라 아직 반영 전일 수 있다 → 한 프레임 뒤 재확인한다.
  await new Promise((resolve) => requestAnimationFrame(resolve));
  return getFullscreenElement() !== null;
}

export function exitFullscreen(): void {
  if (!getFullscreenElement()) return;
  const d = document as FullscreenDocument;
  const fn = document.exitFullscreen ?? d.webkitExitFullscreen;
  fn?.call(document);
}
