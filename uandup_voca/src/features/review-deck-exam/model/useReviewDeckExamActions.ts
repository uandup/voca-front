import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReviewDeckExam, reviewDeckKeys } from '@/entities/review-deck';
import { toExamSubType } from '@/entities/test/@x/review-deck';
import { startOnlineExam, cancelExam, testKeys } from '@/entities/test';
import type { WordTestType } from '@/entities/test/@x/review-deck';

interface CreatePayload {
  testType: WordTestType;
  includeSynonyms: boolean;
  qty: number;
}

interface UseReviewDeckExamActionsParams {
  studentId: number;
  // 활성 시험이 없으면(create 직전) null. start/cancel은 자연스럽게 비활성.
  currentExamId: number | null;
}

// review-deck 도메인에서 발생하는 mutation 묶음.
//   - create  : 새 시험 생성 (assignmentCount = questionCount = qty)
//   - startOnline / cancel : entities/test의 examId-기반 공통 API 재사용
// 어느 mutation도 성공 시 학생의 review-deck 캐시 전체(exams/count/words)를 invalidate해야
// 테이블/카운트/모달이 동시에 신선해진다. count는 시험 생성·취소로 잠재적 변동(서버 정책에 따라)
// 가능성이 있어 함께 갱신.
export function useReviewDeckExamActions({
  studentId,
  currentExamId,
}: UseReviewDeckExamActionsParams) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: reviewDeckKeys.exams(studentId) });
    queryClient.invalidateQueries({ queryKey: reviewDeckKeys.count(studentId) });
    queryClient.invalidateQueries({ queryKey: reviewDeckKeys.words(studentId) });
  };

  const create = useMutation({
    mutationFn: (payload: CreatePayload) =>
      createReviewDeckExam(studentId, {
        subType: toExamSubType(payload.testType),
        includeSynonym: payload.includeSynonyms,
        // UI엔 Quantity 한 개만 — 배정 수와 출제 수를 동일하게 보낸다.
        assignmentCount: payload.qty,
        questionCount: payload.qty,
      }),
    onSuccess: invalidateAll,
  });

  const startOnline = useMutation({
    mutationFn: () => startOnlineExam(currentExamId!),
    onSuccess: invalidateAll,
  });

  const cancel = useMutation({
    mutationFn: () => cancelExam(currentExamId!),
    onSuccess: () => {
      // 취소 후 examDetail 캐시도 stale — 이후 다른 시험을 보더라도 충돌 없게 정리.
      if (currentExamId !== null) {
        queryClient.invalidateQueries({ queryKey: testKeys.examDetail(currentExamId) });
      }
      invalidateAll();
    },
  });

  return { create, startOnline, cancel };
}
