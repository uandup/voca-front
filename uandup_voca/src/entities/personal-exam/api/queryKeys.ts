// 모든 personal-exam 캐시는 학생을 root로 한다 — 학생별 독립적인 도메인(review-deck과 동일 패턴).
export const personalExamKeys = {
  all: ['personal-exam'] as const,
  exams: (studentId: number) => [...personalExamKeys.all, 'exams', studentId] as const,
  detail: (personalExamId: number) => [...personalExamKeys.all, 'detail', personalExamId] as const,
};
