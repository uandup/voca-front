export const classKeys = {
  all: ['classes'] as const,
  list: () => [...classKeys.all, 'list'] as const,
};
