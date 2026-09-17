import type { WordTestType } from '@/entities/test/@x/personal-exam';

// 서버 PersonalExamResponse/PersonalExamSummaryResponse.status.
// ONLINE_STARTED 단계가 없다 — 생성 즉시 응시 가능(READY)해서 step exam과 상태 모델이 다르다.
export type PersonalExamStatus = 'READY' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';

// 개인단어장 시험 이력 테이블 한 행 — usePersonalExamList가 반환 예정(추후 단계).
// ReviewDeckExamRow/LevelTestExamRow와 같은 성격이나 study-set이 없어 studySetId가 없다.
export interface PersonalExamRow {
  personalExamId: number;
  subType: WordTestType;
  status: PersonalExamStatus;
  totalCount: number;
  correctCount: number | null;
  isPassed: boolean | null;
}

// 시험 생성 폼 값 — 개인단어 목록에서 범위(startIndex~endIndex)를 선택해 시험을 만든다.
export interface CreatePersonalExamPayload {
  startIndex: number;
  endIndex: number;
  testType: WordTestType;
}
