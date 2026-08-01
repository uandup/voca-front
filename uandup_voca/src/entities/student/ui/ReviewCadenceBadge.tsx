import type { ReviewCadence } from '../model/reviewCadence';

// 배정 한 행(StudySet)의 복습 밀림 상태를 행 머리에 요약해 보여주는 배지.
//
// step 카드의 배경색은 이미 "시험 상태"(빨강=불합격 / amber=제출·채점대기 / 하늘=응시중)를 뜻하므로,
// 복습 주기 신호는 카드가 아니라 행 레벨에 둬서 두 의미가 색으로 충돌하지 않게 한다.
//
// 밀린 게 없으면 아무것도 그리지 않는다 — 조용해야 밀린 행이 눈에 띈다.

interface Props {
  cadence: ReviewCadence;
  /** 학생 본인 화면이면 true — 문구를 재촉 대신 안내 톤으로 바꾼다 */
  studentTone?: boolean;
}

export function ReviewCadenceBadge({ cadence, studentTone = false }: Props) {
  if (cadence.status === 'ontrack') return null;

  const isBehind = cadence.status === 'behind';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold whitespace-nowrap ${
        isBehind ? 'bg-error/10 text-error' : 'bg-amber-100 text-amber-700'
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
        {isBehind ? 'priority_high' : 'schedule'}
      </span>
      {buildLabel(cadence, studentTone)}
    </span>
  );
}

function buildLabel(cadence: ReviewCadence, studentTone: boolean): string {
  // Word/Sentence가 안 끝나 복습에 진입조차 못한 배정 — 밀린 복습 수를 말해봐야 소용없으므로
  // 실제로 막힌 지점을 지목한다.
  if (cadence.isBlocked) {
    const stepName = cadence.nextStepIndex === 0 ? 'Word' : 'Sentence';
    return studentTone ? `${stepName} test first` : `Blocked at ${stepName}`;
  }

  const reviewNo = cadence.nextReviewNo;
  if (reviewNo === null) return studentTone ? 'Catch up' : 'Review due';

  if (studentTone) return `Review ${reviewNo} to do`;
  return cadence.status === 'behind'
    ? `Behind · Review ${reviewNo} (+${cadence.behindBy})`
    : `Review ${reviewNo} due`;
}
