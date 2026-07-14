// 응시 중 화면 이탈(탭 전환·창 최소화·전체화면 이탈) 누적 횟수 뱃지.
// 학생 응시 화면(ExamTakePage)에서 학생이 실시간으로 보던 "Warnings: N"과 같은 값이며,
// 같은 아이콘(visibility_off)을 써서 둘이 같은 지표임이 드러나게 한다.
//
// null(미측정)과 0(감독했고 이탈 0회)은 의미가 달라 반드시 구분해 표시한다 —
// null을 "이탈 없음"으로 보여주면 감독한 적 없는 오프라인 시험이 결백한 것처럼 읽힌다.

interface ExamViolationBadgeProps {
  count: number | null;
}

const BADGE_STYLE = {
  violated: 'bg-error/10 text-error',
  clean: 'bg-success/10 text-success',
  unmeasured: 'bg-surface-container text-on-surface-variant',
} as const;

const BADGE_ICON = {
  violated: 'visibility_off',
  clean: 'check_circle',
  unmeasured: 'remove',
} as const;

export function ExamViolationBadge({ count }: ExamViolationBadgeProps) {
  const variant = count === null ? 'unmeasured' : count > 0 ? 'violated' : 'clean';

  const label =
    count === null
      ? 'Not measured'
      : count > 0
        ? `${count} violation${count > 1 ? 's' : ''}`
        : 'No violations';

  return (
    <span
      className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold ${BADGE_STYLE[variant]}`}
      title={
        count === null
          ? 'This exam was not supervised (offline exam or unsupported device).'
          : 'Times the student left the exam screen during the test.'
      }
    >
      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
        {BADGE_ICON[variant]}
      </span>
      {label}
    </span>
  );
}
