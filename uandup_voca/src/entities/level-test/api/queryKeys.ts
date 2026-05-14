// 모든 level-test 캐시는 학생을 root로 한다 — 학생별 독립적인 도메인.
export const levelTestKeys = {
  all: ['level-test'] as const,
  exams: (studentId: number) => [...levelTestKeys.all, 'exams', studentId] as const,
};
