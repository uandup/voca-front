import type { WordCardData } from '@/entities/word';
import type { ReviewDeckWord } from '@/entities/review-deck';
import type { PersonalWordCardData } from '@/entities/personal-word';
import type { MobileWordItem } from './types';

// 세 단어 소스를 모바일 공통 뷰모델로 변환한다.
//
// 이 파일이 widget에 있는 이유: word / review-deck / personal-word 세 entity를 동시에 알아야
// 하는데, entity끼리는 직접 import할 수 없다(@x 게이트만 허용). 변환을 한 레이어 위인
// widget에서 수행하면 entity 간 간선이 생기지 않는다.

function fromWordCardData(w: WordCardData): MobileWordItem {
  return {
    id: w.id,
    wordSource: w.wordSource,
    word: w.word,
    korMeaning: w.korMeaning,
    partsOfSpeech: w.partsOfSpeech,
    engMeaning: w.engMeaning,
    synonyms: w.synonyms,
    difficulty: w.difficulty,
    satPriority: w.satPriority,
    examTags: w.examTags,
    sentence: w.sentence,
  };
}

export function toMobileWordItems(words: WordCardData[]): MobileWordItem[] {
  return words.map(fromWordCardData);
}

// ReviewDeckWord는 WordCardData를 extends하므로 공통 변환을 재사용하고 wrongCount만 얹는다.
// 단, 개인 단어장 시험 오답(PERSONAL)은 단어·한글 뜻뿐이다 — 공통 변환을 쓰면 타입을 맞추려 채운
// 기본값(difficulty 1·빈 배열·SAT 0)이 "LV 1"·빈 섹션으로 보이므로, 개인 단어처럼 필요한 것만 담는다.
export function reviewDeckToMobileWordItems(words: ReviewDeckWord[]): MobileWordItem[] {
  return words.map((w) =>
    w.wordSource === 'PERSONAL'
      ? {
          id: w.id,
          wordSource: 'PERSONAL',
          word: w.word,
          korMeaning: w.korMeaning,
          wrongCount: w.wrongCount,
        }
      : { ...fromWordCardData(w), wrongCount: w.wrongCount },
  );
}

// PersonalWord는 단어와 한글뜻밖에 없다 — 나머지는 undefined로 남겨 카드가 섹션을 생략하게 한다.
export function personalToMobileWordItems(words: PersonalWordCardData[]): MobileWordItem[] {
  return words.map((w) => ({
    id: w.id,
    wordSource: 'PERSONAL',
    word: w.word,
    korMeaning: w.koreanMeaning,
  }));
}
