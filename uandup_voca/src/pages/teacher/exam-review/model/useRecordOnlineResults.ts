import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordOnlineResults, testKeys } from '@/entities/test';
import type { ExamType } from '@/entities/test';
import { studentKeys } from '@/entities/student';
import { reviewDeckKeys } from '@/entities/review-deck';
import { levelTestKeys } from '@/entities/level-test';
import { gradeOnline, personalExamKeys } from '@/entities/personal-exam';

interface Params {
  examId: number;
  studentId: number;
  studySetId: number;
  examType: ExamType;
}

type OnlineResultsPayload = Parameters<typeof recordOnlineResults>[1];

// 온라인 채점 결과 저장 mutation.
// 채점 후 어떤 캐시를 갱신할지는 examType에 따라 갈린다.
//   - 일반 step 시험(WORD/EXAMPLE/REVIEWn): clinic-detail의 step 카드와 step별 이력
//   - REVIEW_DECK: review-deck 도메인 — exams 리스트 + count(통과 시 활성 오답 수 변동) + words
//   - LEVEL_TEST : level-test 도메인 — exams 리스트
//   - PERSONAL   : personal-exam 자체 엔드포인트(gradeOnline)를 씀 — entities/test의
//     recordOnlineResults와는 요청 바디 키가 다르다(personalExamItemId vs examItemId). 다만
//     entities/personal-exam의 mapper가 이미 personalExamItemId를 클라이언트 공용 필드
//     ExamItem.examItemId에 정규화해서 담아두므로, 호출부(ExamReviewPage)는 그대로 examItemId
//     기준으로 페이로드를 만들고 여기서 키만 personalExamItemId로 바꿔 보낸다.
// examDetail은 모드 토글 시 graded 상태 반영을 위해 항상 invalidate.
export function useRecordOnlineResults({ examId, studentId, studySetId, examType }: Params) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OnlineResultsPayload) => {
      if (examType === 'PERSONAL') {
        return gradeOnline(examId, {
          results: payload.results.map((r) => ({
            personalExamItemId: r.examItemId,
            isCorrect: r.isCorrect,
            userAnswer: r.userAnswer,
          })),
          isPassed: payload.isPassed,
        });
      }
      return recordOnlineResults(examId, payload);
    },
    onSuccess: () => {
      if (examType === 'PERSONAL') {
        queryClient.invalidateQueries({ queryKey: personalExamKeys.detail(examId) });
        queryClient.invalidateQueries({ queryKey: personalExamKeys.exams(studentId) });
        return;
      }

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
        // 채점 후 alreadyAssigned 상태가 바뀔 수 있으므로 overview도 갱신 — QuickAssignmentCard 반영.
        queryClient.invalidateQueries({ queryKey: studentKeys.overview(studentId) });
      }
    },
  });
}
