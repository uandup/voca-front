import type { ExamType, WordTestType } from '@/entities/test/@x/grading-queue';

// 채점 대기 큐 한 항목 — useSubmittedExams가 반환.
// 학생이 온라인 제출(SUBMITTED)했으나 아직 채점되지 않은 시험 하나의 요약.
// 답안·문항은 포함하지 않는다 — 클릭 시 기존 GET /exams/{examId}로 상세 조회.
//
// examType은 서버 응답 type(WORD/EXAMPLE/REVIEW1~3/WRONG_BANK/LEVEL)을 클라이언트
// ExamType으로 변환한 값이다. 채점 화면(/teacher/exams/$examId/review)의 vocab/sentence
// 분기와 채점 후 invalidation이 이 값을 기준으로 동작한다.
export interface GradingQueueItem {
  examId: number;
  studySetId: number;
  studentId: number;
  studentName: string;
  examType: ExamType;
  // 출제 방향(word-to-meaning / meaning-to-word). 예문 시험(EXAMPLE)은 방향이 없어 null —
  // 이 경우 목록에서 subType 뱃지를 표시하지 않는다.
  subType: WordTestType | null;
  // 동의어 포함 여부. 서버는 EXAMPLE에서 null을 주지만 표시는 boolean으로 정규화(null → false)한다.
  includeSynonym: boolean;
  totalCount: number;
  // null(미측정)과 0(감독했고 이탈 0회)은 의미가 다르므로 구분해 보존한다.
  violationCount: number | null;
  // 이 기능 배포 이전 시험 등은 응시 시작 시각이 없을 수 있다.
  attemptStartedAt: string | null;
  // 목록 정렬 기준(서버가 ASC로 내려줌). SUBMITTED 항목은 항상 값이 있다.
  submittedAt: string;
  // 시험이 생성(배정)된 시각. 목록에 "배정 시각"으로 표시한다.
  createdAt: string;
}
