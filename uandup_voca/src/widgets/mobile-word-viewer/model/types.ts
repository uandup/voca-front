/**
 * 모바일 단어 뷰가 쓰는 단일 뷰모델.
 *
 * 배정 단어(WordCardData) / 오답 단어(ReviewDeckWord) / 개인 단어(PersonalWordCardData)
 * 세 소스를 하나의 카드·플래시카드로 그리기 위한 공통 형태다.
 *
 * **선택 필드를 빈 배열·0으로 채우지 않는다.** PersonalWord는 품사·영영뜻·동의어·난이도·
 * SAT중요도·기출태그·예문이라는 개념 자체가 없다. 빈 값으로 채우면 카드가
 * "개념은 있는데 값이 없음"으로 오인해 빈 섹션과 0개짜리 별점을 그대로 노출한다
 * (entities/personal-word/model/types.ts의 주석이 지적하는 바로 그 함정).
 * undefined로 두면 카드가 섹션 자체를 그리지 않는다.
 */
export interface MobileWordItem {
  id: number;
  word: string;
  korMeaning: string;
  partsOfSpeech?: string[];
  engMeaning?: string;
  synonyms?: string[];
  difficulty?: number;
  satPriority?: number;
  examTags?: string[];
  sentence?: string;
  // 오답 단어에만 있는 "틀린 횟수". 목록에서 배지로 보여준다.
  wrongCount?: number;
}
