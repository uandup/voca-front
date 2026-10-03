// personal-word 캐시는 학생이 아니라 **세트**를 root로 한다 — 단어 조회 API가 세트 단위이기 때문.
// 캐시 키가 fetch 인자와 1:1로 대응해야 한다: 학생을 키로 쓰면 세트 A와 B가 같은 엔트리를 공유해
// A를 열었다 B를 열면 A의 단어가 보이고, B에 단어를 추가하면 A 목록이 갱신된다.
export const personalWordKeys = {
  all: ['personal-word'] as const,
  bySet: (personalWordSetId: number) =>
    [...personalWordKeys.all, 'by-set', personalWordSetId] as const,
};
