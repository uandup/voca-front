export type PartOfSpeech = 'N' | 'V' | 'Adj' | 'Adv' | 'Conj';
export type WordDifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

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
export interface WrongWordCard {
  id: number;
  difficulty: WordDifficultyLevel;
  word: string;
  partOfSpeech: PartOfSpeech;
  korMeaning: string;
  engMeaning: string;
  synonyms: string[];
  wrongCount: number;
}

/** VocabularyBankPage (teacher) — TeacherWordCard with sentence footer */
export interface TeacherWordCardVM {
  id: number;
  difficulty: WordDifficultyLevel;
  word: string;
  partOfSpeech: PartOfSpeech;
  korMeaning: string;
  engMeaning: string;
  synonyms: string[];
  sentence: string;
}

// ── Test Pages ──────────────────────────────────────────────────────────────

/** TestPage (word-to-meaning / meaning-to-word) — VocabAnswerRow */
export interface VocabTestItem {
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
