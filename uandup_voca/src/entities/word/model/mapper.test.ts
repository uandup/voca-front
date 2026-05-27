import { describe, it, expect } from 'vitest';
import { toTeacherWord } from './mapper';

describe('toTeacherWord', () => {
  it('백엔드 소문자 약어 7종을 클라이언트 대소문자 약어로 변환한다', () => {
    const result = toTeacherWord({
      id: 1,
      partsOfSpeech: ['n', 'v', 'adj', 'adv', 'prep', 'conj', 'interj'],
    });
    expect(result.partsOfSpeech).toEqual(['N', 'V', 'Adj', 'Adv', 'Prep', 'Conj', 'Interj']);
  });

  it('알 수 없는 POS는 N으로 폴백', () => {
    const result = toTeacherWord({ id: 1, partsOfSpeech: ['pron', 'GARBAGE'] });
    expect(result.partsOfSpeech).toEqual(['N', 'N']);
  });

  it('sentence는 서버의 example 필드에서 매핑된다', () => {
    expect(toTeacherWord({ id: 1, example: 'Run fast.' }).sentence).toBe('Run fast.');
  });

  it('synonyms 미존재 시 빈 배열', () => {
    expect(toTeacherWord({ id: 1 }).synonyms).toEqual([]);
  });

  it('null 필드들은 빈 문자열로 fallback (word, korMeaning, engMeaning)', () => {
    const result = toTeacherWord({ id: 1 });
    expect(result.word).toBe('');
    expect(result.korMeaning).toBe('');
    expect(result.engMeaning).toBe('');
  });
});
