// 모든 personal-test 캐시는 학생을 root로 한다 — 학생별 독립적인 도메인.
export const personalTestKeys = {
  all: ['personal-test'] as const,
  exams: (studentId: number) => [...personalTestKeys.all, 'exams', studentId] as const,
};
