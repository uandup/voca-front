import { useQuery } from '@tanstack/react-query';
import { getWords, toWordCardData, wordKeys } from '@/entities/word';

interface SearchParams {
  keyword: string;
  level: number | '';
}

export function useVocabularyBank(searchParams: SearchParams, page: number) {
  const { data } = useQuery({
    queryKey: wordKeys.search({ keyword: searchParams.keyword, level: searchParams.level, page }),
    queryFn: () =>
      getWords({
        keyword: searchParams.keyword || undefined,
        difficulty: searchParams.level || undefined,
        page,
        size: 20,
      }),
    select: (res) => ({
      words: res.data?.content?.map(toWordCardData) ?? [],
      totalElements: res.data?.totalElements ?? 0,
      totalPages: res.data?.totalPages ?? 0,
    }),
  });

  return {
    words: data?.words ?? [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
  };
}
