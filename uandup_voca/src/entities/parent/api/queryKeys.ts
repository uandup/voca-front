export const parentKeys = {
  all: ['parents'] as const,
  list: () => [...parentKeys.all, 'list'] as const,
};
