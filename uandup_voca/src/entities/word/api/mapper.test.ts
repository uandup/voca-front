import { describe, it, expect } from 'vitest';
import { toWordCreateRequest, toWordUpdateRequest } from './mapper';
import type { TeacherWord } from '../model/types';

const base: Omit<TeacherWord, 'id'> = {
  word: 'go',
  partsOfSpeech: ['V'],
  korMeaning: '가다',
  engMeaning: 'to move',
  difficulty: 3,
  synonyms: ['move'],
  sentence: 'Let go.',
};

describe('toWordCreateRequest', () => {
  it('빈 영문 뜻은 undefined로 (서버가 비어있는 string 거부할 수 있음)', () => {
    const result = toWordCreateRequest({ ...base, engMeaning: '' });
    expect(result.englishMeaning).toBeUndefined();
  });

  it('빈 예문은 undefined로', () => {
    const result = toWordCreateRequest({ ...base, sentence: '' });
    expect(result.example).toBeUndefined();
  });

  it('빈 synonyms 배열은 undefined로 (서버가 빈 배열 거부)', () => {
    const result = toWordCreateRequest({ ...base, synonyms: [] });
    expect(result.synonyms).toBeUndefined();
  });

  it('값이 있으면 그대로 전달', () => {
    const result = toWordCreateRequest(base);
    expect(result.englishMeaning).toBe('to move');
    expect(result.example).toBe('Let go.');
    expect(result.synonyms).toEqual(['move']);
  });

  it('koreanMeaning 필드명으로 매핑된다 (snake가 아니라 camel)', () => {
    expect(toWordCreateRequest(base).koreanMeaning).toBe('가다');
  });
});

describe('toWordUpdateRequest', () => {
  // create와 동일 본문이지만 별도 export됨 — 동작 동일성 확인.
  it('toWordCreateRequest와 같은 결과를 반환한다', () => {
    expect(toWordUpdateRequest(base)).toEqual(toWordCreateRequest(base));
  });
});
