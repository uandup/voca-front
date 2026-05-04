export type PartOfSpeech = 'N' | 'V' | 'Adj' | 'Adv' | 'Conj';
export type WordDifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Word {
  id: number;
  word: string;
  partOfSpeech: PartOfSpeech;
  korMeaning: string;
  engMeaning: string;
  difficulty: WordDifficultyLevel;
  synonyms: string[];
  exampleSentence: string;
}

export type WrongWord = Word & {
  wrongCount?: number;
};

export interface TestWord {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
  synonym?: string;
}

