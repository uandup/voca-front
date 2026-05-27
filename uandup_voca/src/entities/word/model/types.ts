export type PartOfSpeech = 'N' | 'V' | 'Adj' | 'Adv' | 'Prep' | 'Conj' | 'Interj';
export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type WordDifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// ── Student Vocab Pages ─────────────────────────────────────────────────────

/** WordCard 컴포넌트의 기본 데이터(예문 제외). */
export interface WordCardData {
  id: number;
  difficulty: WordDifficultyLevel;
  word: string;
  partsOfSpeech: PartOfSpeech[];
  korMeaning: string;
  engMeaning: string;
  synonyms: string[];
}

/** 예문(sentence)까지 포함한 단어 — WordCard가 받는 전체 데이터. */
export interface TeacherWord extends WordCardData {
  sentence: string;
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
