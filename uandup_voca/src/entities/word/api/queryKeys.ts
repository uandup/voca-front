export interface WordSearchParams {
  keyword: string;
  level: number | '';
  page: number;
}

export const wordKeys = {
  all: ['words'] as const,
  searches: () => [...wordKeys.all, 'search'] as const,
  search: (params: WordSearchParams) => [...wordKeys.searches(), params] as const,
  levelCount: (level: number) => [...wordKeys.all, 'levelCount', level] as const,
};
