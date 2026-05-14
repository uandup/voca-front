// review-deck entity가 word entity로부터 import할 수 있는 표면.
// ReviewDeckWord 타입이 WordCard를 extends하고, mapper가 PartOfSpeech/WordDifficultyLevel을 사용,
// 모달 UI가 TeacherWordCard를 재사용한다.
export type { WordCard, TeacherWord, PartOfSpeech, WordDifficultyLevel } from '../model/types';
export { TeacherWordCard } from '../ui/TeacherWordCard';
