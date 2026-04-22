export type StepStatus =
  | 'locked' // 이전 단계 미통과 - 잠김
  | 'waiting' // 선생님이 아직 시험을 열지 않음
  | 'available' // 선생님이 시험을 열어줌 - 시험 시작 가능
  | 'grading' // 학생 제출 후 선생님 채점 대기
  | 'fail' // 불합격 - 결과 확인 + 재시험 대기
  | 'passed'; // 합격 - 다음 단계 오픈

export type TestType = 'Meaning to Word' | 'Word to Meaning';

export interface TestStep {
  key: string;
  label: string;
  status: StepStatus;
  gradedDate?: string;
  scores?: string[];
  totalScore?: string;
  testType?: TestType;
}
