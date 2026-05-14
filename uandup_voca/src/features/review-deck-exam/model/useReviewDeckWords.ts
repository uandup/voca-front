import { useQuery } from '@tanstack/react-query';
import { getReviewDeckWords, reviewDeckKeys, toReviewDeckWord } from '@/entities/review-deck';

// 모달이 열릴 때만 fetch — 페이지 진입만으로 불필요한 호출이 일어나지 않게 한다.
// 서버 기본 정렬은 lastWrongAt 오름차순(오래된 순)이지만, UI에선 wrongCount 내림차순으로
// 자주 틀린 단어를 위에 보이도록 클라이언트에서 재정렬한다.
export function useReviewDeckWords(studentId: number, enabled: boolean) {
  return useQuery({
    queryKey: reviewDeckKeys.words(studentId),
    queryFn: () => getReviewDeckWords(studentId),
    select: (res) =>
      (res.data ?? [])
        .map(toReviewDeckWord)
        .sort((a, b) => b.wrongCount - a.wrongCount),
    enabled: enabled && studentId > 0,
  });
}
