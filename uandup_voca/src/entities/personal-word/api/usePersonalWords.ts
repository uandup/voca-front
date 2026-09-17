import { useQuery } from '@tanstack/react-query';
import { getPersonalWords } from './personalWordApi';
import { toPersonalWordCardData } from '../model/mapper';
import { personalWordKeys } from './queryKeys';

export function usePersonalWords(studentId: number, enabled = true) {
  return useQuery({
    queryKey: personalWordKeys.list(studentId),
    queryFn: () => getPersonalWords(studentId),
    select: (res) => (res.data ?? []).map(toPersonalWordCardData),
    enabled: enabled && studentId > 0,
  });
}
