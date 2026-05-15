import { useQuery } from '@tanstack/react-query';
import { getAssignedWords, toAssignedTeacherWord, studentKeys } from '@/entities/student';

export function useAssignedWords(studySetId: number, enabled: boolean) {
  return useQuery({
    queryKey: studentKeys.studyWords(studySetId),
    queryFn: () => getAssignedWords(studySetId),
    select: (res) => (res.data ?? []).map(toAssignedTeacherWord),
    enabled,
  });
}
