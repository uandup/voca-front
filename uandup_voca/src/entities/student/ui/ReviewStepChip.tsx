import type { ReviewStepSignal } from '../model/reviewCadence';

// step 카드 이름 옆에 붙는 복습 신호 칩. 날짜 기반 시절의 "Due {날짜}" 칩을 대체한다.
//
//   upcoming — 아직 회차가 안 됨. 막지는 않고 몇 행이 되어야 열리는지만 알려준다.
//   due      — 지금 볼 차례.
//   overdue  — 두 단계 이상 밀림.
//
// 카드 배경색은 시험 상태 전용이라 여기서는 칩만 얹는다(색 의미 충돌 방지).

interface Props {
  signal: ReviewStepSignal;
  /** 학생 카드는 폭이 좁아 한 단계 작은 글자를 쓴다 */
  compact?: boolean;
}

export function ReviewStepChip({ signal, compact = false }: Props) {
  if (signal.kind === 'none') return null;

  const size = compact ? 'text-[9px] xl:text-[11px] px-1 xl:px-2' : 'text-[11px] px-2';
  const base = `inline-flex items-center rounded-md py-0.5 font-bold whitespace-nowrap ${size}`;

  if (signal.kind === 'upcoming') {
    return <span className={`${base} bg-slate-100 text-slate-500`}>Opens at #{signal.unlockRow}</span>;
  }
  if (signal.kind === 'overdue') {
    return <span className={`${base} bg-error/10 text-error`}>OVERDUE</span>;
  }
  return <span className={`${base} bg-amber-100 text-amber-700`}>DUE NOW</span>;
}
