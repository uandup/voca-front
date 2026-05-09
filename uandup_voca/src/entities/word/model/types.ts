export type PartOfSpeech = 'N' | 'V' | 'Adj' | 'Adv' | 'Conj';
export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type WordDifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// ── Student Vocab Pages ─────────────────────────────────────────────────────

/** VocabListPage, LevelWordListPage — StudentWordCard */
export interface WordCard {
  id: number;
  difficulty: WordDifficultyLevel;
  word: string;
  partOfSpeech: PartOfSpeech;
  korMeaning: string;
  engMeaning: string;
  synonyms: string[];
}

/** WrongWordListPage — StudentWordCard with wrongCount badge */
export interface WrongWord extends WordCard {
  wrongCount: number;
}

/** VocabularyBankPage (teacher) — TeacherWordCard with sentence footer */
export interface TeacherWord extends WordCard {
  sentence: string;
}

// ── Test Pages ──────────────────────────────────────────────────────────────

/** TestPage (word-to-meaning / meaning-to-word) — VocabAnswerRow */
export interface WordTestItem {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
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

/** TestReviewPage (sentence mode) — SentenceReviewRow */
export interface SentenceReviewItem {
  id: number;
  sentence: string;
  answerWord: string;
  studentWord: string;
}
