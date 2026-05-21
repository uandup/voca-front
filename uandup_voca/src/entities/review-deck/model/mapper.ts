import type { components } from '@/shared/api/schema.gen';
import type { PartOfSpeech, WordDifficultyLevel } from '@/entities/word/@x/review-deck';
import type { ReviewDeckExamRow, ReviewDeckWord, ReviewDeckExamStatus } from './types';

type WrongBankExamListResponse = components['schemas']['WrongBankExamListResponse'];
type WrongBankWordResponse = components['schemas']['WrongBankWordResponse'];

const VALID_POS = new Set(['N', 'V', 'Adj', 'Adv', 'Conj']);

function toPartOfSpeech(value: string): PartOfSpeech {
  if (VALID_POS.has(value)) return value as PartOfSpeech;
  return 'N';
}

export function toReviewDeckExamRow(r: WrongBankExamListResponse): ReviewDeckExamRow {
  return {
    examId: r.examId ?? 0,
    studySetId: r.studySetId ?? 0,
    createdAt: r.createdAt ?? '',
    wordCount: r.wordCount ?? 0,
    status: (r.status ?? 'READY') as ReviewDeckExamStatus,
    correctCount: r.correctCount ?? null,
    totalCount: r.questionCount ?? null,
  };
}

export function toReviewDeckWord(r: WrongBankWordResponse): ReviewDeckWord {
  return {
    id: r.wordId ?? 0,
    word: r.word ?? '',
    partsOfSpeech: (r.partsOfSpeech ?? []).map(toPartOfSpeech),
    korMeaning: r.koreanMeaning ?? '',
    engMeaning: r.englishMeaning ?? '',
    difficulty: (r.difficulty ?? 1) as WordDifficultyLevel,
    synonyms: r.synonyms ?? [],
    wrongCount: r.wrongCount ?? 0,
    lastWrongAt: r.lastWrongAt ?? '',
    sentence: r.example ?? '',
  };
}
