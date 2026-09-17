// personal-exam entity가 test entity로부터 import할 수 있는 표면.
// PersonalExam은 자체 엔드포인트(/api/v1/personal-exams/...)로 응시·제출·결과를 처리하지만,
// 화면(ExamTakePage/ExamReviewPage)과 widgets/test-online은 entities/test의 클라이언트 타입
// (ExamDetail/ExamAttemptData)만 알면 되므로, personal-exam의 mapper가 이 타입으로 변환한다.
export type { WordTestType, ExamDetail, ExamItem, ExamAttemptData, ExamAttemptItem } from '../model/types';
export { toWordTestType } from '../model/mapper';
export { toExamSubType } from '../api/mapper';
