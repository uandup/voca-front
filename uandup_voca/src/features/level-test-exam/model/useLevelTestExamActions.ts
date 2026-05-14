import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLevelTestExam, levelTestKeys } from '@/entities/level-test';
import { toExamSubType } from '@/entities/test/@x/level-test';
import { startOnlineExam, cancelExam, testKeys } from '@/entities/test';
import type { WordTestType } from '@/entities/test/@x/level-test';
import type { WordDifficultyLevel } from '@/entities/word/@x/level-test';

interface CreatePayload {
  level: WordDifficultyLevel;
  testType: WordTestType;
  includeSynonyms: boolean;
  assignmentCount: number;
  questionCount: number;
}

interface UseLevelTestExamActionsParams {
  studentId: number;
  // 활성 시험이 없으면 null. start/cancel은 자연스럽게 비활성.
  currentExamId: number | null;
}

// level-test 도메인에서 발생하는 mutation 묶음.
//   - create  : 새 레벨 시험 생성 (assignmentCount / questionCount 각각 전송)
//   - startOnline / cancel : entities/test의 examId-기반 공통 API 재사용
// 어느 mutation도 성공 시 학생의 level-test exam 리스트를 invalidate해야 테이블이 신선해진다.
export function useLevelTestExamActions({
  studentId,
  currentExamId,
}: UseLevelTestExamActionsParams) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: levelTestKeys.exams(studentId) });
  };

  const create = useMutation({
    mutationFn: (payload: CreatePayload) =>
      createLevelTestExam(studentId, {
        level: payload.level,
        subType: toExamSubType(payload.testType),
        includeSynonym: payload.includeSynonyms,
        assignmentCount: payload.assignmentCount,
        questionCount: payload.questionCount,
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
      if (currentExamId !== null) {
        queryClient.invalidateQueries({ queryKey: testKeys.examDetail(currentExamId) });
      }
      invalidateAll();
    },
  });

  return { create, startOnline, cancel };
}
