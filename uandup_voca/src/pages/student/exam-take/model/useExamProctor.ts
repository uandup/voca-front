import { useState, useEffect, useRef } from 'react';
import {
  isFullscreenSupported,
  getFullscreenElement,
  requestFullscreenVerified,
  exitFullscreen,
} from '@/shared/lib/fullscreen';

// 응시 중 화면 이탈 감독(proctoring) 훅.
//   - 탭 전환 / 창 최소화  : visibilitychange 로 감지
//   - 전체화면 이탈(ESC/F11): fullscreenchange 로 감지 + 문항을 가림막으로 덮는다
// 전체화면 "강제"는 브라우저가 허용하지 않는다(진입은 클릭 제스처 필요, ESC 이탈은 차단 불가).
// 그래서 이탈을 막는 대신 이탈한 동안 문항을 가려 훔쳐볼 수 없게 하고, 이탈 횟수를 집계한다.

// 위반 1건이 두 이벤트로 중복 집계되는 것을 막는 합산 창(ms). 아래 addViolation 주석 참고.
const VIOLATION_DEDUPE_MS = 1000;

// 감독은 PC(마우스가 주 입력) 한정이다. 태블릿·모바일 Safari는 일반 요소의 전체화면 진입이
// 불가능한데, 그럼에도 가림막을 띄우면 학생이 시험에 갇혀 응시 자체가 불가능해진다
// (실제로 이 사고 때문에 PR #31이 통째로 revert됐다).
function isProctorSupported(): boolean {
  return window.matchMedia('(pointer: fine)').matches && isFullscreenSupported();
}

interface UseExamProctorParams {
  // 응시 중(attempt 로드 완료)일 때만 true.
  active: boolean;
}

export function useExamProctor({ active }: UseExamProctorParams) {
  // 감독 불가 기기이거나 전체화면 진입에 실패한 세션 → 감독을 끄고 시험을 정상 진행시킨다.
  const [disabled, setDisabled] = useState(() => !isProctorSupported());
  const [isFullscreen, setIsFullscreen] = useState(() => getFullscreenElement() !== null);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const on = active && !disabled;

  // 전체화면에 한 번이라도 진입했는지 — 최초 진입 전의 "전체화면 아님"은 위반이 아니다.
  const enteredOnceRef = useRef(false);
  const lastViolationAtRef = useRef(0);

  useEffect(() => {
    if (!on) return;

    function addViolation() {
      // Windows에서 전체화면 중 Alt+Tab하면 visibilitychange와 fullscreenchange가 둘 다 발화해
      // 1회 이탈이 2회로 집계된다 → 짧은 시간 내 재발화는 같은 이탈로 보고 합산하지 않는다.
      const now = Date.now();
      if (now - lastViolationAtRef.current < VIOLATION_DEDUPE_MS) return;
      lastViolationAtRef.current = now;
      setViolationCount((n) => n + 1);
      setShowWarning(true);
    }

    // 탭 전환·창 최소화 — 화면이 숨겨지는 "순간"에 집계한다. 그래야 돌아왔을 때 경고가 이미 떠 있다.
    function onVisibilityChange() {
      if (document.hidden) addViolation();
    }

    // 전체화면 이탈 — 옆에 다른 창을 띄우려는 시도로 보고 위반으로 집계한다.
    // 이탈해 있는 동안은 isBlocked가 true가 되어 문항이 가림막에 덮인다.
    function onFullscreenChange() {
      const fs = getFullscreenElement() !== null;
      setIsFullscreen(fs);
      if (fs) {
        enteredOnceRef.current = true;
      } else if (enteredOnceRef.current) {
        addViolation();
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, [on]);

  // 응시 화면을 벗어날 때 전체화면을 해제한다 — 제출 후 결과(/review) 화면이 전체화면에 갇히지 않게.
  useEffect(() => {
    return () => exitFullscreen();
  }, []);

  // 가림막의 버튼에서 호출한다 — 전체화면 진입은 사용자 클릭 제스처 안에서만 허용된다.
  async function enterFullscreen() {
    if (await requestFullscreenVerified()) {
      enteredOnceRef.current = true;
      setIsFullscreen(true);
      return;
    }
    // 지원한다고 주장했지만 실제로는 진입하지 못한 기기. 여기서 가림막을 유지하면 학생이
    // 시험에 갇힌다 → 감독을 끄고 시험을 그대로 진행시킨다.
    setDisabled(true);
  }

  return {
    // 전체화면을 벗어난 상태 — 문항을 가림막으로 덮어야 한다.
    isBlocked: on && !isFullscreen,
    // 화면 표시용 누적 위반 횟수.
    violationCount,
    // 서버로 보낼 위반 횟수. 감독이 꺼진 세션은 undefined → 제출 페이로드에서 키가 빠져
    // 서버에 null(미측정)로 저장된다. 서버는 null(미측정)과 0(측정했고 이탈 0회)을 구분해
    // 저장하므로, 감독하지 않은 세션에 0을 보내면 안 된다.
    reportedViolationCount: disabled ? undefined : violationCount,
    showWarning,
    dismissWarning: () => setShowWarning(false),
    enterFullscreen,
  };
}
