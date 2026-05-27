// review-deck entity가 word entity로부터 import할 수 있는 표면.
// ReviewDeckWord 타입이 WordCardData를 extends하고, mapper가 PartOfSpeech/WordDifficultyLevel을 사용,
// 모달 UI가 WordCard 컴포넌트를 재사용한다.
export type { WordCardData, PartOfSpeech, WordDifficultyLevel } from '../model/types';
export { WordCard } from '../ui/WordCard';
