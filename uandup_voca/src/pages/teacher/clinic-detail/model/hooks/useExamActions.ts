import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createExam,
  startOnlineExam,
  cancelExam,
  recordOnlineResults,
  recordOfflineResults,
  testKeys,
} from '@/entities/test';
import type { ExamType } from '@/entities/test';
import { studentKeys } from '@/entities/student';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type ExamHistoryCache = ApiResponse<components['schemas']['StudySetExamTypeResponse']>;

interface UseExamActionsParams {
  studySetId: number;
  studentId: number;
  examType: ExamType;
  currentExamId: number | null;
}

export function useExamActions({
  studySetId,
  studentId,
  examType,
  currentExamId,
}: UseExamActionsParams) {
  const queryClient = useQueryClient();

  // 시험 상태가 *변경*되는 경우(create/start/grade): step 카드와 이 step의 examHistory를 refetch.
  const invalidateStep = () => {
    queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });
    queryClient.invalidateQueries({ queryKey: testKeys.history(studySetId, examType) });
  };

  const create = useMutation({
    mutationFn: () => createExam(studySetId, { examType }),
    onSuccess: invalidateStep,
  });

  const startOnline = useMutation({
    mutationFn: () => startOnlineExam(currentExamId!),
    onSuccess: invalidateStep,
  });

  const cancel = useMutation({
    mutationFn: () => cancelExam(currentExamId!),
    // 취소 후엔 서버에 current 시험이 없다. invalidate/remove는 활성 observer가 있는 한 자동 refetch를
    // 트리거하여 404("시험 없음" — 잘못된 접근에 대한 응답)를 받게 된다.
    // 따라서 서버 재호출 없이 캐시의 current만 직접 비워둔다. 이후 새 시험이 생성되면 그때
    // create.onSuccess의 invalidateStep으로 fresh fetch가 일어난다.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });
      queryClient.setQueryData<ExamHistoryCache>(
        testKeys.history(studySetId, examType),
        (old) => (old ? { ...old, data: { ...old.data, current: undefined } } : old),
      );
    },
  });

  // 채점 후엔 examDetail(items.isCorrect/userAnswer)도 갱신 — 결과 모달 재오픈 시 stale 방지.
  const invalidateAfterGrade = () => {
    invalidateStep();
    if (currentExamId !== null) {
      queryClient.invalidateQueries({ queryKey: testKeys.examDetail(currentExamId) });
    }
  };

  const gradeOnline = useMutation({
    mutationFn: (payload: Parameters<typeof recordOnlineResults>[1]) =>
      recordOnlineResults(currentExamId!, payload),
    onSuccess: invalidateAfterGrade,
  });

  const gradeOffline = useMutation({
    mutationFn: (payload: Parameters<typeof recordOfflineResults>[1]) =>
      recordOfflineResults(currentExamId!, payload),
    onSuccess: invalidateAfterGrade,
  });

  return { create, startOnline, cancel, gradeOnline, gradeOffline };
}
