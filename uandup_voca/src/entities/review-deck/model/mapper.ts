import type { components } from '@/shared/api/schema.gen';
import type { PartOfSpeech, WordDifficultyLevel } from '@/entities/word/@x/review-deck';
import type { ReviewDeckExamRow, ReviewDeckWord, ReviewDeckExamStatus } from './types';

type WrongBankExamListResponse = components['schemas']['WrongBankExamListResponse'];
type WrongBankWordResponse = components['schemas']['WrongBankWordResponse'];

// 백엔드는 소문자 약어('n', 'v', 'adj', 'adv', 'prep', 'conj', 'interj')로 내려준다.
const POS_MAP: Record<string, PartOfSpeech> = {
  n: 'N',
  v: 'V',
  adj: 'Adj',
  adv: 'Adv',
  prep: 'Prep',
  conj: 'Conj',
  interj: 'Interj',
};

function toPartOfSpeech(value: string): PartOfSpeech {
  return POS_MAP[value.toLowerCase()] ?? 'N';
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
    satPriority: r.satPriority ?? 0,
    examTags: r.examTag
      ? r.examTag.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    wrongCount: r.wrongCount ?? 0,
    lastWrongAt: r.lastWrongAt ?? '',
    sentence: r.example ?? '',
  };
}
