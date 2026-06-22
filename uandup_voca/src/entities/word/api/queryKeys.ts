export interface WordSearchParams {
  keyword: string;
  level: number | '';
  page: number;
}

export const wordKeys = {
  all: ['words'] as const,
  searches: () => [...wordKeys.all, 'search'] as const,
  search: (params: WordSearchParams) => [...wordKeys.searches(), params] as const,
  stats: () => [...wordKeys.all, 'stats'] as const,
};
