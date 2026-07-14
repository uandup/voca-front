import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { type ExamSource, useExamAttempt } from '@/entities/test';
import { useSubmitExam } from '@/features/exam';
import { useCurrentStudentId } from '@/entities/auth';
import { studentKeys } from '@/entities/student';
import { reviewDeckKeys } from '@/entities/review-deck';
import { levelTestKeys } from '@/entities/level-test';
import { useExamAnswers } from './useExamAnswers';
import { useExamItems } from './useExamItems';

export type { ExamSource };

// ExamType → ExamSource 변환은 entities/test에 있지만, 라우트 search param 파싱과 함께
// 페이지에서 직접 inferSource를 import해서 쓴다.

interface UseExamTakeParams {
  // 라우트 examId — attempt·submit 대상.
  routeExamId: number;
  isSentence: boolean;
  source: ExamSource;
  currentPage: number;
  onSubmitSuccess: () => void;
}

// useExamAttempt(응시용 시험 로드), useExamAnswers, useExamItems, useSubmitExam을 조합하는 응시 훅.
// attempt가 성공하면 항상 응시(answer) 상태다 — 이미 응시했거나 시작 전인 시험은 attempt가 error로 온다.
// review/submitted 결과 확인은 pages/student/exam-review의 useExamReview가 담당한다.
export function useExamTake({
  routeExamId,
  isSentence,
  source,
  currentPage,
  onSubmitSuccess,
}: UseExamTakeParams) {
  const studentId = useCurrentStudentId() ?? 0;
  const queryClient = useQueryClient();
  const { data: attempt, loading, error } = useExamAttempt(routeExamId);

  // 응시를 시작하면(attempt 성공) 서버에 attemptStartedAt이 기록되어 시험이 재응시 불가로 잠긴다.
  // 목록/할일 캐시는 응시 시작 전 데이터라, 나가서 돌아올 때 stale한 'active'를 보여준다 → 무효화해
  // 재진입 시 refetch되어 'attempted'로 잠기게 한다. (제출 시 useSubmitExam이 하는 것과 같은 이유)
  useEffect(() => {
    if (!attempt) return;
    queryClient.invalidateQueries({ queryKey: studentKeys.todos(studentId) });
    if (source === 'review-deck') {
      queryClient.invalidateQueries({ queryKey: reviewDeckKeys.exams(studentId) });
    } else if (source === 'level-test') {
      queryClient.invalidateQueries({ queryKey: levelTestKeys.exams(studentId) });
    } else {
      queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });
    }
    // attempt는 1회만 세팅되므로 성공 직후 1회 무효화한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const showSynonym = attempt?.includeSynonym ?? false;

  const answers = useExamAnswers({ isSentence, showSynonym });
  const items = useExamItems({ attempt, isSentence, currentPage });

  const submit = useSubmitExam({ examId: routeExamId, studentId, source });

  // itemOrder(클라이언트 키) → examItemId(서버 식별자)로 매핑하여 제출 페이로드 구성.
  // /submit은 멱등이 아니라 중복 시 400이므로, 제출 중(isPending)이면 재호출하지 않는다.
  //
  // violationCount = 응시 중 화면 이탈 횟수(useExamProctor). 감독이 꺼진 세션(태블릿 등 미지원
  // 기기)에서는 undefined로 넘어와 페이로드에서 키가 빠진다 — 서버는 키 없음(null=미측정)과
  // 0(측정했고 이탈 0회)을 다르게 저장하므로 undefined를 0으로 대체하면 안 된다.
  function doSubmit(violationCount?: number) {
    if (!attempt || submit.isPending) return;
    const results = attempt.items.map((item) => {
      const order = item.itemOrder;
      if (isSentence) {
        return {
          examItemId: item.examItemId,
          wordAnswer: answers.sentenceAnswers[order]?.answer ?? '',
        };
      }
      const a = answers.vocabAnswers[order];
      return {
        examItemId: item.examItemId,
        wordAnswer: a?.answer ?? '',
        synonymAnswer: a?.synonym ?? '',
      };
    });
    submit.mutate({ results, violationCount }, { onSuccess: onSubmitSuccess });
  }

  return {
    attempt,
    isLoading: loading,
    error,
    showSynonym,
    isSubmitting: submit.isPending,
    doSubmit,
    ...answers,
    ...items,
  };
}
