import { useQuery } from '@tanstack/react-query';
import { getWords, toTeacherWord } from '@/entities/word';

interface SearchParams {
  keyword: string;
  level: number | '';
}

export function useVocabularyBank(searchParams: SearchParams, page: number) {
  const { data } = useQuery({
    queryKey: ['words', searchParams.keyword, searchParams.level, page],
    queryFn: () =>
      getWords({
        keyword: searchParams.keyword || undefined,
        difficulty: searchParams.level || undefined,
        page,
        size: 20,
      }),
    select: (res) => ({
      words: res.data?.content?.map(toTeacherWord) ?? [],
      totalElements: res.data?.totalElements ?? 0,
      totalPages: res.data?.totalPages ?? 0,
    }),
    staleTime: Infinity,
  });

  return {
    words: data?.words ?? [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
  };
}
