export type PartOfSpeech = 'N' | 'V' | 'Adj' | 'Adv' | 'Prep' | 'Conj' | 'Interj';
export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type WordDifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// ── Student Vocab Pages ─────────────────────────────────────────────────────

/** WordCard 컴포넌트 데이터. sentence는 exampleVisible에 따라 optional. */
export interface WordCardData {
  id: number;
  difficulty: WordDifficultyLevel;
  word: string;
  partsOfSpeech: PartOfSpeech[];
  korMeaning: string;
  engMeaning: string;
  synonyms: string[];
  sentence?: string;
}

// ── Test Pages ──────────────────────────────────────────────────────────────

/** TestPage (word-to-meaning / meaning-to-word) — VocabAnswerRow */
export interface WordTestItem {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
  synonyms: string[];
}

/** TestPage (sentence mode) — SentenceAnswerRow */
export interface SentenceTestItem {
  id: number;
  sentence: string;
}

/** TestReviewPage (word-to-meaning / meaning-to-word) — VocabReviewRow */
export interface VocabReviewItem {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
  synonymAnswer: string;
}
