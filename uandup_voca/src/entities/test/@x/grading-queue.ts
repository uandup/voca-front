// grading-queue entity가 test entity로부터 import할 수 있는 표면.
// 채점 대기 큐 항목의 서버 type(enum)을 클라이언트 ExamType으로 변환해 채점 화면 링크에 넘기는 데 필요.
export type { ExamType } from '../model/types';
