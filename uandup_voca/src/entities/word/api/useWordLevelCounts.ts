import { useQuery } from '@tanstack/react-query';
import { wordKeys } from './queryKeys';
import { getWordStats } from './wordApi';

export function useWordLevelCounts() {
  return useQuery({
    queryKey: wordKeys.stats(),
    queryFn: getWordStats,
    select: (res) => res.data,
  });
}
