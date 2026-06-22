import { useQuery } from '@tanstack/react-query';
import { wordKeys } from './queryKeys';
import { getWordCountByLevel } from './wordApi';

export function useWordCountByLevel(level: number) {
  return useQuery({
    queryKey: wordKeys.levelCount(level),
    queryFn: () => getWordCountByLevel(level),
    select: (res) => res.data?.count ?? null,
    enabled: level > 0,
  });
}
