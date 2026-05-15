import type { WordDifficultyLevel } from '@/entities/word/@x/level-test';
import type { WordTestType } from '@/entities/test/@x/level-test';

// 서버 LevelExamListResponse.status는 typed enum이 아니지만,
// 도메인 의미상 review-deck과 동일한 5상태로 좁혀 사용한다.
// READY/IN_PROGRESS/SUBMITTED는 활성(취소·재시도 가능), PASSED/FAILED는 종료.
export type LevelTestExamStatus = 'READY' | 'IN_PROGRESS' | 'SUBMITTED' | 'PASSED' | 'FAILED';

// 테이블 한 행 — useLevelTestExamList가 반환.
// wordCount는 배정된 총 단어 수, questionCount는 시험에 출제될 문항 수.
// correctCount/totalCount는 PASSED·FAILED일 때만 채워진다.
export interface LevelTestExamRow {
  examId: number;
  studySetId: number;
  createdAt: string;
  level: WordDifficultyLevel;
  wordCount: number;
  questionCount: number;
  status: LevelTestExamStatus;
  correctCount: number | null;
  totalCount: number | null;
}

// Generate Test 폼 값. review-deck과 달리 배정 개수/시험 개수가 분리된다.
export interface LevelTestExamConfig {
  selectedLevel: WordDifficultyLevel;
  assignmentCount: number;
  questionCount: number;
  testType: WordTestType;
  includeSynonyms: boolean;
}
