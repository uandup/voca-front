import type { WordCardData } from '@/entities/word/@x/review-deck';
import type { WordTestType } from '@/entities/test/@x/review-deck';

// 서버 WrongBankExamListResponse.status — examType 기반 step 시험과 enum이 다르다.
// READY/IN_PROGRESS/SUBMITTED는 활성(취소·재시도 가능), PASSED/FAILED는 종료.
export type ReviewDeckExamStatus = 'READY' | 'IN_PROGRESS' | 'SUBMITTED' | 'PASSED' | 'FAILED';

// 테이블 한 행 — useReviewDeckExamList가 반환.
// correctCount/totalCount는 PASSED·FAILED일 때만 채워진다.
export interface ReviewDeckExamRow {
  examId: number;
  studySetId: number;
  createdAt: string;
  wordCount: number;
  status: ReviewDeckExamStatus;
  correctCount: number | null;
  totalCount: number | null;
}

// 활성 오답 단어 — 모달에서 WordCard extraInfo로 wrongCount 배지를 표시한다.
// lastWrongAt은 정렬 기준이며 화면 표시는 선택적.
export interface ReviewDeckWord extends WordCardData {
  wrongCount: number;
  lastWrongAt: string;
  sentence: string;
}

// Generate Test 폼 값. UI엔 qty 하나만 노출되고 assignmentCount = questionCount로 전송.
export interface ReviewDeckExamConfig {
  qty: number;
  testType: WordTestType;
  includeSynonyms: boolean;
}
