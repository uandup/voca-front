import type { StepCardVM } from '@/entities/test/@x/student';

/**
 * 복습 시점 = 날짜가 아니라 "이 배정 이후 배정이 몇 회 더 쌓였는가".
 *
 * 배정 현황 목록(GET /api/v1/normal-study-sets/students/{studentId}/active)은 서버가
 * id DESC 고정 · 페이징 없이 전체 배열로 내려주는 것을 계약으로 보장한다.
 * 따라서 배열 index + 1을 그대로 화면의 행 번호(rowNo)로 쓸 수 있고, 별도 회차 필드는 없다.
 *
 * 서버 기준 "REVIEW1 = +1회 / REVIEW2 = +3회 / REVIEW3 = +6회" → 행 번호 2 / 4 / 7부터.
 *
 * 지금은 이 규칙으로 **막지 않고 표시만** 한다. 날짜 기반 시절에도 예정일은 안내였을 뿐
 * Generate Test를 막지 않았고, 순서가 뒤엉키는 것은 기존 단계 잠금(앞 단계 통과)이 이미 막는다.
 * 회차 규칙이 추가로 막는 것은 "순서는 맞는데 너무 빠른 진행"뿐이라 선생님 판단에 맡긴다.
 * 나중에 잠가야 하면 매퍼의 isLocked에 dueReviewStage 결과를 한 줄 얹으면 된다.
 *
 * 간격은 프론트 상수라 조정 시 프론트만 배포하면 된다.
 */
export const REVIEW_UNLOCK_ROWS = [2, 4, 7] as const;

/** steps 배열에서 Review 1이 시작되는 index (0=Word, 1=Sentence, 2~4=Review 1~3) */
export const FIRST_REVIEW_STEP_INDEX = 2;

/** rowNo(1-based, 최신 배정 = 1) 기준으로 지금까지 끝냈어야 하는 복습 단계 수 — 0~3 */
export function dueReviewStage(rowNo: number): number {
  return REVIEW_UNLOCK_ROWS.filter((row) => rowNo >= row).length;
}

/** reviewNo(1~3)가 열리는 행 번호 */
export function reviewUnlockRow(reviewNo: number): number {
  return REVIEW_UNLOCK_ROWS[reviewNo - 1];
}

/** 통과 또는 스킵 — 어느 쪽이든 다음 단계를 여는 "끝난 단계" */
function isCleared(step: StepCardVM): boolean {
  return step.status === 'passed' || step.status === 'skipped';
}

export type ReviewCadenceStatus =
  // 회차상 열린 복습을 전부 끝냈다 — 화면에 아무 신호도 띄우지 않는다.
  | 'ontrack'
  // 지금 봐야 할 복습이 정확히 하나.
  | 'due'
  // 두 단계 이상 밀렸다.
  | 'behind';

export interface ReviewCadence {
  /** 1-based 행 번호. 최신 배정 = 1 */
  rowNo: number;
  /** 회차상 끝냈어야 하는 복습 단계 수 (0~3) */
  dueStage: number;
  /** dueStage - doneStage. 0이면 정상 */
  behindBy: number;
  status: ReviewCadenceStatus;
  /** 지금 진행해야 할 복습 번호(1~3). 밀린 복습이 없으면 null */
  nextReviewNo: number | null;
  /** 지금 진행해야 할 step index(0~4). 5단계가 다 끝났으면 null */
  nextStepIndex: number | null;
  /** Word/Sentence를 아직 못 끝내 복습에 진입조차 못한 상태 */
  isBlocked: boolean;
}

/**
 * 한 배정(행)의 복습 진도를 회차 기준으로 판정한다.
 * @param steps toTestBundleRow가 만든 5칸 step 배열 (Word / Sentence / Review 1~3)
 * @param rowNo active 목록에서의 1-based 행 번호
 */
export function toReviewCadence(steps: StepCardVM[], rowNo: number): ReviewCadence {
  // 복습은 순차 잠금이라 앞에서부터 연속으로 끝난 개수만 센다.
  let doneStage = 0;
  for (let i = FIRST_REVIEW_STEP_INDEX; i < steps.length; i++) {
    if (!isCleared(steps[i])) break;
    doneStage++;
  }

  const foundIndex = steps.findIndex((step) => !isCleared(step));
  const nextStepIndex = foundIndex === -1 ? null : foundIndex;

  const dueStage = dueReviewStage(rowNo);
  const behindBy = Math.max(0, dueStage - doneStage);

  return {
    rowNo,
    dueStage,
    behindBy,
    status: behindBy === 0 ? 'ontrack' : behindBy === 1 ? 'due' : 'behind',
    nextReviewNo: doneStage < dueStage ? doneStage + 1 : null,
    nextStepIndex,
    // 7행인데 예문조차 못 뚫은 배정을 "Review 3 밀림"으로 뭉개지 않고 실제 막힌 지점을 지목하기 위한 플래그.
    isBlocked: nextStepIndex !== null && nextStepIndex < FIRST_REVIEW_STEP_INDEX,
  };
}

export type ReviewStepSignal =
  | { kind: 'none' }
  // 아직 회차가 안 됐다 — 막지는 않고 언제 열리는지만 알려준다.
  | { kind: 'upcoming'; unlockRow: number }
  | { kind: 'due' }
  | { kind: 'overdue' };

/**
 * step 카드 한 칸에 붙일 신호. 날짜 기반 시절의 "Due {날짜}" 칩을 대체한다.
 * 복습 칸에만 붙고, due/overdue는 "지금 할 칸" 하나에만 나타난다.
 */
export function toReviewStepSignal(
  steps: StepCardVM[],
  stepIndex: number,
  cadence: ReviewCadence,
): ReviewStepSignal {
  if (stepIndex < FIRST_REVIEW_STEP_INDEX) return { kind: 'none' };

  const step = steps[stepIndex];
  if (isCleared(step)) return { kind: 'none' };

  const reviewNo = stepIndex - FIRST_REVIEW_STEP_INDEX + 1;
  if (reviewNo > cadence.dueStage) {
    return { kind: 'upcoming', unlockRow: reviewUnlockRow(reviewNo) };
  }

  // 앞 단계가 아직 남아 있으면 이 칸은 조용히 둔다 — 신호는 한 칸에만.
  if (stepIndex !== cadence.nextStepIndex) return { kind: 'none' };

  return cadence.status === 'behind' ? { kind: 'overdue' } : { kind: 'due' };
}
