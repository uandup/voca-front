export interface Vocab {
  word: string;
  partOfSpeech: "Noun" | "Verb" | "Adjective" | "Adverb" | "Conjunction";
  koreanMeaning: string;
  difficultyLevel: 1 | 2 | 3 | 4;
  englishMeaning: string;
  synonyms: string[];
  exampleSentence: string;
}
