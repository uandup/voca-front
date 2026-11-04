export type PartOfSpeech = 'N' | 'V' | 'Adj' | 'Adv' | 'Prep' | 'Conj' | 'Interj';

// 단어 출처 — 공용 단어장(WORD) / 학생 개인 단어(PERSONAL).
// 두 테이블의 ID 시퀀스가 따로라 같은 숫자가 겹친다 → 단어 식별(React key·북마크)은 (출처, id) 쌍으로 한다(toWordKey).
// 오답 뱅크·오답 시험 배정은 두 출처가 섞이고, 개인 단어장 시험 배정은 전부 PERSONAL이다.
export type WordSource = 'WORD' | 'PERSONAL';
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
  // SAT 중요도 0~3. 0이면 별 표시 없음.
  satPriority: number;
  // 기출 태그 목록. 서버의 콤마 구분 문자열을 파싱한 배열.
  examTags: string[];
  // 단어 출처. 생략하면 공용 단어(WORD). PERSONAL이면 단어·한글 뜻만 의미가 있고
  // 레벨·품사·영영뜻·동의어·SAT·기출 태그는 개념 자체가 없다 — WordCard가 그 섹션을 그리지 않는다.
  wordSource?: WordSource;
}

// ── Test Pages ──────────────────────────────────────────────────────────────

/** TestPage (word-to-meaning / meaning-to-word) — VocabAnswerRow */
export interface WordTestItem {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
  synonyms: string[];
  // 이 문항엔 동의어 입력칸을 두지 않는다 — 개인 단어 문항(동의어 없음)이 오답 뱅크 시험에 섞일 때.
  // 시험 단위 showSynonym이 true여도 이 문항만 끈다. 생략 = false.
  synonymDisabled?: boolean;
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
  // WordTestItem.synonymDisabled와 동일 — 동의어 칸을 이 문항만 숨긴다.
  synonymDisabled?: boolean;
}
