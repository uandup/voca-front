export interface Vocab {
  word: string;
  partOfSpeech: "N" | "V" | "Adj" | "Adv" | "Conj";
  koreanMeaning: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  englishMeaning: string;
  synonyms: string[];
  exampleSentence: string;
}
