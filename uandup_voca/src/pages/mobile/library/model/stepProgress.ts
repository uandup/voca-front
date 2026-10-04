import type { StepCardVM } from '@/entities/test';

/**
 * 폰에서 보여줄 단계 표시 — 3가지로 접는다.
 *
 * 서버/데스크탑의 StepStatus는 7가지(locked·pending·active·grading·submitted·fail·passed·skipped)지만,
 * **폰은 단어를 외우는 화면이지 시험을 보는 화면이 아니다.** "응시 중"·"채점 대기"·"재시험 필요"를
 * 구분해봐야 폰에서 할 수 있는 행동이 없어 읽는 부담만 늘어난다.
 * 세부 상태가 필요하면 데스크탑 /student/word-test에 이미 다 있다.
 */
export type MobileStepMark = 'done' | 'skipped' | 'todo';

export function toStepMark(status: StepCardVM['status']): MobileStepMark {
  if (status === 'passed') return 'done';
  if (status === 'skipped') return 'skipped';
  // pending · locked · active · grading · submitted · fail — 전부 "아직 통과 못 함"으로 묶는다.
  return 'todo';
}

/**
 * 레벨 라벨. 숫자만 칩으로 띄우면 그게 레벨인지 알 수 없어 "Level"을 앞에 붙인다.
 * 한 배정이 레벨 경계를 넘으면 2개가 되지만(레벨당 단어가 많아 3개 이상은 사실상 없다)
 * 그 경우도 "Level 6 · 7"로 한 줄에 들어간다.
 *
 * entities/word의 LevelBlock(색 농도로 레벨을 표현하는 숫자 칩)을 쓰지 않는 이유:
 * 폰에서는 칩 하나가 무엇을 뜻하는지 짚어줄 맥락이 없다. 데스크탑 테이블처럼
 * 열 제목이 "Level"이라고 말해주는 자리가 아니다.
 */
export function toLevelLabel(levels: { level: number }[]): string {
  if (levels.length === 0) return 'Level —';
  return `Level ${levels.map((l) => l.level).join(' · ')}`;
}
