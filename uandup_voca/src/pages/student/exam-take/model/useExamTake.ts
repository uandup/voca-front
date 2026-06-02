import { type ExamMode, type ExamSource, inferMode, useExamDetail } from '@/entities/test';
import { useSubmitExam } from '@/features/exam';
import { useCurrentStudentId } from '@/entities/auth';
import { useExamAnswers } from './useExamAnswers';
import { useExamItems } from './useExamItems';

export type { ExamMode, ExamSource };
export { inferMode };

// ExamType → ExamSource 변환은 entities/test에 있지만, 라우트 search param 파싱과 함께
// 페이지에서 직접 inferSource를 import해서 쓴다.

interface UseExamTakeParams {
  // 라우트 examId — submit 대상. 탭 전환 중에도 변하지 않는다.
  routeExamId: number;
  // 현재 표시할 examId — 탭 전환 시 selectedExamId, 단일 시도 시 routeExamId와 동일.
  examId: number;
  isSentence: boolean;
  source: ExamSource;
  currentPage: number;
  onSubmitSuccess: () => void;
}

// useExamDetail, useExamAnswers, useExamItems, useSubmitExam을 조합하는 answer 모드 훅.
// review/submitted 모드는 pages/student/exam-review의 useExamReview가 담당한다.
export function useExamTake({
  routeExamId,
  examId,
  isSentence,
  source,
  currentPage,
  onSubmitSuccess,
}: UseExamTakeParams) {
  const studentId = useCurrentStudentId() ?? 0;
  const { data: examDetail, isLoading } = useExamDetail(examId);

  const mode = examDetail ? inferMode(examDetail.status) : ('answer' as ExamMode);
  const showSynonym = examDetail?.includeSynonym ?? false;
  const isAnswerMode = mode === 'answer';

  const answers = useExamAnswers({ examDetail, isSentence, showSynonym });
  const items = useExamItems({ examDetail, isSentence, currentPage });

  const submit = useSubmitExam({ examId: routeExamId, studentId, source });

  // itemOrder(클라이언트 키) → examItemId(서버 식별자)로 매핑하여 제출 페이로드 구성.
  function doSubmit() {
    if (!examDetail) return;
    const results = examDetail.items.map((item) => {
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
    submit.mutate({ results }, { onSuccess: onSubmitSuccess });
  }

  return {
    examDetail,
    isLoading,
    mode,
    showSynonym,
    isAnswerMode,
    doSubmit,
    ...answers,
    ...items,
  };
}
