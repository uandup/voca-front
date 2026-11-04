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

// 오답 뱅크엔 공용 단어(WORD)와 개인 단어장 시험 오답(PERSONAL)이 섞여 있다.
// PERSONAL은 단어·한글 뜻만 있고, difficulty 등은 서버가 null로 내려준다 — 타입을 맞추려 채운 기본값은
// WordCard가 wordSource를 보고 그리지 않으므로 화면에 "LEVEL 1"로 새지 않는다.
export function toReviewDeckWord(r: WrongBankWordResponse): ReviewDeckWord {
  return {
    id: r.wordId ?? 0,
    wordSource: r.wordSource ?? 'WORD',
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
