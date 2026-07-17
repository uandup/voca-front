// 채점 대기 큐는 학원 전체 공용 단일 목록이라 스코프 파라미터가 없다.
export const gradingQueueKeys = {
  all: ['grading-queue'] as const,
  list: () => [...gradingQueueKeys.all, 'list'] as const,
};
