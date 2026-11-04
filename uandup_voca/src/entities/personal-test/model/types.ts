// 개인 단어장 시험 — 학생 개인 단어 세트 1개의 등록순 범위에서 선생님이 내는 시험.
// 서버 enum은 PERSONAL, 클라이언트 ExamType은 'PERSONAL_TEST'(REVIEW_DECK·LEVEL_TEST와 같은 관례).

// 서버 PersonalExamListResponse.status — 레벨·오답 뱅크 시험과 같은 5상태.
// READY/IN_PROGRESS/SUBMITTED는 활성(취소·채점 가능), PASSED/FAILED는 종료.
export type PersonalTestExamStatus = 'READY' | 'IN_PROGRESS' | 'SUBMITTED' | 'PASSED' | 'FAILED';

// 시험 이력 테이블 한 행 — usePersonalTestExamList가 반환.
export interface PersonalTestExamRow {
  examId: number;
  studySetId: number;
  createdAt: string;
  personalWordSetId: number | null;
  // 세트 행을 못 찾으면 null. 세트가 이후 삭제돼도 이름은 남는다(personalWordSetDeleted로 표시).
  personalWordSetName: string | null;
  personalWordSetDeleted: boolean;
  // 생성 시점의 등록순 번호(1부터, 양끝 포함) — 이후 단어를 지우면 현재 화면 번호와 다를 수 있다.
  rangeStart: number | null;
  rangeEnd: number | null;
  // 범위 단어 수(배정 풀)와 출제 문항 수는 별개다.
  wordCount: number;
  questionCount: number;
  status: PersonalTestExamStatus;
  // PASSED·FAILED일 때만 채워진다.
  correctCount: number | null;
  totalCount: number | null;
  // 학생이 이미 응시를 시작했는지 — true면 재응시 불가(응시 버튼 잠금).
  attempted: boolean;
}
