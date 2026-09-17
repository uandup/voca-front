import type { WordTestType } from '@/entities/test';
import type { WordTestItem } from '@/entities/word';

// 자체 시험 설정. 실제 시험 설정(StudentOverview)과 같은 세 항목만 다룬다.
export interface SelfTestConfig {
  testType: WordTestType;
  questionCount: number;
  includeSynonyms: boolean;
}

// setup   : 설정 화면 (아직 문제 없음)
// testing : 답 작성 중
// checked : 정답 공개 + 학생이 직접 채점
export type SelfTestPhase = 'setup' | 'testing' | 'checked';

// Start 시점에 고정되는 한 번의 시험 회차.
// 설정을 문제와 함께 묶어 두는 이유 — 응시 중 overview가 재조회(창 포커스 등)되어 선생님 설정이
// 바뀌어도, 이미 시작한 시험의 방향/동의어 여부가 중간에 뒤집히지 않게 하기 위함이다.
export interface SelfTestSession {
  config: SelfTestConfig;
  // id는 1..N으로 다시 매긴 출제 순서 (ProgressPanel이 id로 페이지를 계산한다).
  questions: WordTestItem[];
}
