export const memoKeys = {
  all: ['memos'] as const,
  byStudent: (studentId: number) => [...memoKeys.all, 'student', studentId] as const,
};
