// personal-word 캐시는 학생을 root로 한다 — 학생별 독립적인 도메인(review-deck과 동일 패턴).
export const personalWordKeys = {
  all: ['personal-word'] as const,
  list: (studentId: number) => [...personalWordKeys.all, 'list', studentId] as const,
};
