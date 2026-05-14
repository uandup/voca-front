// review-deck entity가 test entity로부터 import할 수 있는 표면.
// 시험 subType(서버 enum) ↔ 클라이언트 WordTestType 변환에 필요.
export type { WordTestType } from '../model/types';
export { toExamSubType } from '../api/mapper';
