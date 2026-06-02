import { useMemo, useState } from 'react';
import { useRouter, useParams, useSearch } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { type ExamType } from '@/entities/test';
import { TestHeader, TestPagination, ProgressPanel } from '@/widgets/test-online';
import { useExamReview } from './model/useExamReview';
import { ExamReviewTable } from './ui/ExamReviewTable';

// 학생 시험 결과 확인 페이지.
// review(채점 완료)와 submitted(채점 대기) 두 모드를 처리한다.
// 응시 중인 시험은 ExamTakePage(/take)가 담당한다.

export default function ExamReviewPage() {
  const { examId: examIdParam } = useParams({ from: '/student_/exams/$examId/review' });
  const search = useSearch({ from: '/student_/exams/$examId/review' });
  const router = useRouter();

  const routeExamId = Number(examIdParam);

  // allExamIds가 있으면 복수 시도 탭 전환 뷰. "examId:score,..." 형식 → { examId, score }[].
  const examAttempts: { examId: number; score: string }[] = useMemo(() => {
    if (!search.allExamIds) return [];
    return search.allExamIds
      .split(',')
      .map((part) => {
        const colonIdx = part.indexOf(':');
        const examId = Number(part.slice(0, colonIdx));
        const score = part.slice(colonIdx + 1);
        return { examId, score };
      })
      .filter((a) => !isNaN(a.examId) && a.examId > 0);
  }, [search.allExamIds]);

  const showAttemptTabs = examAttempts.length > 1;

  // --- 렌더링 상태 ---
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExamId, setSelectedExamId] = useState(routeExamId);

  const examType: ExamType = (search.examType ?? 'WORD') as ExamType;
  const isSentence = examType === 'EXAMPLE';
  const examId = showAttemptTabs ? selectedExamId : routeExamId;

  const {
    examDetail,
    isLoading,
    mode,
    testType,
    showSynonym,
    vocabPageItems,
    vocabReviewPageItems,
    sentencePageItems,
    allIds,
    totalPages,
    wrongIds,
    sentenceCorrectAnswers,
    vocabReviewAnswers,
    sentenceAnswers,
  } = useExamReview({ examId, isSentence, currentPage });

  function handleExit() {
    if (search.returnTo) {
      router.history.replace(search.returnTo);
    } else {
      router.history.back();
    }
  }

  // 헤더 중앙: 복수 시도면 탭, 아니면 없음.
  const headerCenter = showAttemptTabs ? (
    <>
      {examAttempts.map((attempt) => (
        <button
          key={attempt.examId}
          onClick={() => setSelectedExamId(attempt.examId)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            selectedExamId === attempt.examId
              ? 'bg-primary text-white'
              : 'text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
          }`}
        >
          {attempt.score === '-' ? '-' : attempt.score}
        </button>
      ))}
    </>
  ) : undefined;

  if (isLoading || !examDetail) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <TestHeader onExit={handleExit} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TestHeader onExit={handleExit} center={headerCenter} />

      <div className="relative flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          <ExamReviewTable
            mode={mode}
            isSentence={isSentence}
            testType={testType}
            showSynonym={showSynonym}
            currentPage={currentPage}
            totalPages={totalPages}
            vocab={{
              pageItems: vocabPageItems,
              reviewItems: vocabReviewPageItems,
              answers: vocabReviewAnswers,
              reviewAnswers: vocabReviewAnswers,
              wrongIds,
            }}
            sentence={{
              pageItems: sentencePageItems,
              answers: sentenceAnswers,
              correctAnswers: sentenceCorrectAnswers,
            }}
          />

          <TestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <ProgressPanel
          questionIds={allIds}
          completedCount={allIds.length}
          remainingCount={0}
          completedIds={new Set(allIds)}
          wrongIds={mode === 'review' ? wrongIds : undefined}
          mode="review"
          onQuestionClick={setCurrentPage}
        />
      </div>
    </div>
  );
}
