import { type ExamDetail, type ExamType, type WordTestType, useExamDetail } from '@/entities/test';
import { useSubmitExam } from '@/features/exam';
import { useCurrentStudentId } from '@/entities/auth';
import { useExamAnswers } from './useExamAnswers';
import { useExamItems } from './useExamItems';

export type ExamMode = 'answer' | 'review' | 'submitted';
export type ExamSource = 'study-set' | 'review-deck' | 'level-test';

export function inferMode(status: string): ExamMode {
  if (status === 'COMPLETED' || status === 'PASSED' || status === 'FAILED') return 'review';
  if (status === 'SUBMITTED') return 'submitted';
  return 'answer';
}

export function inferSource(examType: ExamType | undefined): ExamSource {
  if (examType === 'REVIEW_DECK') return 'review-deck';
  if (examType === 'LEVEL_TEST') return 'level-test';
  return 'study-set';
}

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

// useExamDetail, useExamAnswers, useExamItems, useSubmitExam을 조합하는 최상위 시험 훅.
// 페이지는 이 훅을 통해 시험에 필요한 모든 데이터와 액션을 얻는다.
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
