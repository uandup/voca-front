import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPersonalTestExam, personalTestKeys } from '@/entities/personal-test';
import { startOnlineExam, cancelExam, testKeys, toExamSubType } from '@/entities/test';
import type { WordTestType } from '@/entities/test';
import { studentKeys } from '@/entities/student';

export interface CreatePersonalTestPayload {
  personalWordSetId: number;
  // 세트의 활성 단어를 등록순으로 1번부터 매긴 범위(양끝 포함)
  startIndex: number;
  endIndex: number;
  // 화면에서 시작·끝 번호에 보였던 단어 id — 그 사이 학생이 단어를 지워 번호가 밀렸으면 서버가 409로 거절한다
  expectedStartWordId: number;
  expectedEndWordId: number;
  questionCount: number;
  testType: WordTestType;
}

// personal-test 도메인에서 발생하는 mutation 묶음.
//   - create  : 새 개인 단어장 시험 생성 (세트 + 범위 + 문항 수)
//   - startOnline / cancel : entities/test의 examId-기반 공통 API 재사용
//
// 레벨·오답 뱅크 시험과 달리 학생당 동시 진행 개수 제한이 없어 진행 중 시험이 여러 개일 수 있다 —
// 그래서 "현재 시험 하나"를 훅 인자로 받지 않고 startOnline/cancel이 호출마다 examId를 받는다.
// 행별 진행 표시는 mutation.variables(=진행 중인 examId)로 구분한다.
export function usePersonalTestExamActions(studentId: number) {
  const queryClient = useQueryClient();

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: personalTestKeys.exams(studentId) });
    // 시작·취소는 학생 할 일 목록(활성 시험)을 바꾼다
    queryClient.invalidateQueries({ queryKey: studentKeys.todos(studentId) });
  };

  const create = useMutation({
    mutationFn: (payload: CreatePersonalTestPayload) =>
      createPersonalTestExam(studentId, {
        personalWordSetId: payload.personalWordSetId,
        startIndex: payload.startIndex,
        endIndex: payload.endIndex,
        expectedStartWordId: payload.expectedStartWordId,
        expectedEndWordId: payload.expectedEndWordId,
        questionCount: payload.questionCount,
        subType: toExamSubType(payload.testType),
      }),
    onSuccess: invalidateLists,
  });

  const startOnline = useMutation({
    mutationFn: (examId: number) => startOnlineExam(examId),
    onSuccess: invalidateLists,
  });

  const cancel = useMutation({
    mutationFn: (examId: number) => cancelExam(examId),
    onSuccess: (_data, examId) => {
      queryClient.invalidateQueries({ queryKey: testKeys.examDetail(examId) });
      invalidateLists();
    },
  });

  return { create, startOnline, cancel };
}
