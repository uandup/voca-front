// grading-queue entity가 test entity로부터 import할 수 있는 표면.
// - ExamType: 서버 type(enum)을 클라이언트 ExamType으로 변환해 채점 화면 링크에 넘기는 데 필요.
// - WordTestType / toWordTestType: 서버 subType을 클라이언트 출제 방향으로 변환해 목록 뱃지에 쓰는 데 필요.
export type { ExamType, WordTestType } from '../model/types';
export { toWordTestType } from '../model/mapper';
