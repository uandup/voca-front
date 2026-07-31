interface ExamFullscreenGateProps {
  onEnterFullscreen: () => void;
  onExit: () => void;
  // 'start'  : 최초 시작 게이트 — 아직 응시가 확정되지 않았다(attempt POST 미발사). 여기서
  //            나가도 시험은 소진되지 않는다. 버튼 클릭이 응시 확정 + 전체화면 진입을 함께 한다.
  // 'resume' : 응시 중 전체화면을 벗어난 상태 — 복귀를 유도한다. (기본값)
  mode?: 'start' | 'resume';
}

const COPY: Record<'start' | 'resume', { title: string; body: string; action: string }> = {
  start: {
    title: 'Ready to start this exam?',
    body: 'The exam runs in fullscreen and starts the moment you begin. Once started it cannot be retaken. Leaving fullscreen, switching tabs, or switching to another app or window is recorded and shared with your teacher.',
    action: 'Start Exam',
  },
  // 'resume'은 전체화면 이탈뿐 아니라 창 포커스 상실(앱 전환·Mission Control)로도 뜬다.
  // 두 경우 모두 자연스럽게 읽히도록 "전체화면"에 한정하지 않은 문구를 쓴다.
  resume: {
    title: 'Stay on the exam screen',
    body: 'Questions stay hidden while this window is in the background or out of fullscreen. Leaving fullscreen, switching tabs, or switching to another app or window during the exam is recorded and shared with your teacher.',
    action: 'Return to Exam',
  },
};

/**
 * 전체화면을 벗어난 동안 시험 문항을 덮는 불투명 가림막.
 * 최초 진입 시엔 전체화면 시작 게이트로(mode='start'), 이탈 후엔 복귀 유도로(mode='resume') 동작한다.
 *
 * - 루트의 형제로 렌더해 TestHeader(sticky z-10)까지 덮는다 → 문항뿐 아니라 Submit 버튼도
 *   가려지므로 "훔쳐본 뒤 제출"하는 경로가 막힌다.
 * - shared/ui/Modal을 쓰지 않는다 — Modal은 body 스크롤을 잠가 시험 화면 스크롤을 망가뜨린다.
 *   경고/나가기 모달(z-50)은 이 가림막(z-40) 위에 정상적으로 뜬다.
 * - 전체화면 강제는 불가능하므로 Exit 경로를 항상 함께 제공해 학생이 시험에 갇히지 않게 한다.
 */
export function ExamFullscreenGate({ onEnterFullscreen, onExit, mode = 'resume' }: ExamFullscreenGateProps) {
  const copy = COPY[mode];
  return (
    <div className="fixed inset-0 z-40 bg-surface flex flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>
        fullscreen
      </span>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-on-surface">{copy.title}</h2>
        <p className="text-sm text-on-surface-variant max-w-md">{copy.body}</p>
      </div>

      <button
        onClick={onEnterFullscreen}
        className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
      >
        {copy.action}
      </button>

      <button
        onClick={onExit}
        className="text-xs font-semibold text-on-surface-variant underline hover:text-on-surface"
      >
        Exit Exam
      </button>
    </div>
  );
}
