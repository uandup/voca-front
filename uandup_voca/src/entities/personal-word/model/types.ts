// PersonalWordCard 컴포넌트 데이터. entities/word의 WordCardData와 달리 품사·영영뜻·동의어·
// 난이도·SAT우선순위·기출태그·예문 개념이 아예 없다 — 억지로 WordCardData에 맞추면(빈 배열/0으로
// 채우기) WordCard가 "개념은 있지만 값이 없음"으로 오인해 빈 섹션/빈 별을 그대로 노출한다.
// PersonalWord는 그 개념 자체가 없으므로 필드 자체를 두지 않는다.
export interface PersonalWordCardData {
  id: number;
  word: string;
  koreanMeaning: string;
}
