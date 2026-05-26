import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordOnlineResults, testKeys } from '@/entities/test';
import type { ExamType } from '@/entities/test';
import { studentKeys } from '@/entities/student';
import { reviewDeckKeys } from '@/entities/review-deck';
import { levelTestKeys } from '@/entities/level-test';

interface Params {
  examId: number;
  studentId: number;
  studySetId: number;
  examType: ExamType;
}

// 온라인 채점 결과 저장 mutation.
// 채점 후 어떤 캐시를 갱신할지는 examType에 따라 갈린다.
//   - 일반 step 시험(WORD/EXAMPLE/REVIEWn): clinic-detail의 step 카드와 step별 이력
//   - REVIEW_DECK: review-deck 도메인 — exams 리스트 + count(통과 시 활성 오답 수 변동) + words
//   - LEVEL_TEST : level-test 도메인 — exams 리스트
// examDetail은 모드 토글 시 graded 상태 반영을 위해 항상 invalidate.
export function useRecordOnlineResults({ examId, studentId, studySetId, examType }: Params) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof recordOnlineResults>[1]) =>
      recordOnlineResults(examId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testKeys.examDetail(examId) });

      if (examType === 'REVIEW_DECK') {
        queryClient.invalidateQueries({ queryKey: reviewDeckKeys.exams(studentId) });
        queryClient.invalidateQueries({ queryKey: reviewDeckKeys.count(studentId) });
        queryClient.invalidateQueries({ queryKey: reviewDeckKeys.words(studentId) });
      } else if (examType === 'LEVEL_TEST') {
        queryClient.invalidateQueries({ queryKey: levelTestKeys.exams(studentId) });
      } else {
        queryClient.invalidateQueries({ queryKey: testKeys.history(studySetId, examType) });
        queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });
      }
    },
  });
}
