// 모든 review-deck 캐시는 학생을 root로 한다 — 학생별 독립적인 도메인.
export const reviewDeckKeys = {
  all: ['review-deck'] as const,
  exams: (studentId: number) => [...reviewDeckKeys.all, 'exams', studentId] as const,
  count: (studentId: number) => [...reviewDeckKeys.all, 'count', studentId] as const,
  words: (studentId: number) => [...reviewDeckKeys.all, 'words', studentId] as const,
};
