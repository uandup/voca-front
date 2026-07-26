import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExam, startOnlineExam, testKeys } from '@/entities/test';
import type { StudySetExamType } from '@/entities/test';
import { studentKeys } from '@/entities/student';

interface Params {
  studentId: number;
  studySetId: number;
  // 생성할 step 시험 타입. 예문 배정 → 'EXAMPLE', 재시험 → 현재 채점 중인 단계 타입.
  examType: StudySetExamType;
}

// 채점 화면에서 step 시험(WORD/EXAMPLE/REVIEW1~3)을 생성+응시개시하는 범용 mutation.
// 두 곳에서 재사용된다:
//   - 예문 배정: WORD를 Pass로 채점한 뒤 다음 단계(EXAMPLE)를 연다
//   - 재시험:    한 단계를 Fail로 채점한 뒤 같은 단계를 다시 만든다
//
// clinic-detail의 useExamActions.create/startOnline은 재사용할 수 없다:
//   - pages 레이어끼리는 import 금지(FSD)
//   - 그 hook의 startOnline은 미리 알고 있는 currentExamId를 쓰는 구조라 방금 만든 시험엔 못 씀
// 그래서 이 페이지 전용으로 최소 형태만 둔다(useRecordOnlineResults가 같은 이유로 로컬인 것과 동일).
//
// 문항 수/subType/동의어 여부는 서버가 학생 프로필에서 읽어가므로 body는 examType만 보낸다.
// 생성만으로는 학생이 응시할 수 없어(READY 상태), 응답의 examId로 start-online까지 연쇄한다.
export function useCreateAndStartStepExam({ studentId, studySetId, examType }: Params) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await createExam(studySetId, { examType });
      const newExamId = res.data?.examId;
      if (!newExamId) throw new Error('Exam was created but no examId was returned.');
      await startOnlineExam(newExamId);
    },
    // onSuccess가 아니라 onSettled로 무효화한다 — createExam은 성공했는데 startOnlineExam이
    // 실패한 부분 실패 상황에서도 시험은 이미 생성됐으므로, 상태를 갱신해야 버튼이
    // (step이 pending/fail→active/grading으로 바뀌며) 사라진다. onSuccess만 걸면 그 경우 버튼이
    // 남아 재클릭 시 EXAM_ALREADY_ACTIVE 에러로 이어진다.
    onSettled: () => {
      // studySets를 갱신해야 이 페이지의 버튼 노출 판정(step 상태)이 즉시 닫힌다.
      queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });
      // 해당 단계 history도 무효화 — 안 하면 클리닉 화면의 step이 낡은 상태로 보인다.
      queryClient.invalidateQueries({ queryKey: testKeys.history(studySetId, examType) });
    },
    // onError는 두지 않는다 — 전역 MutationCache.onError가 서버 메시지
    // (EXAM_ALREADY_ACTIVE / EXAM_ALREADY_PASSED / EXAM_QUESTION_COUNT_EXCEEDS_ASSIGNED)를
    // AlertDialog로 띄운다. (SkipStepButton의 컨벤션 참고)
  });
}
