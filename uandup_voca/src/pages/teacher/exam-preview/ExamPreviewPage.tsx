import { useState } from 'react';
import { useRouter, useParams, useSearch } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ITEMS_PER_PAGE, type ExamType } from '@/entities/test';
import {
  TestHeader,
  TestPagination,
  VocabPreviewTable,
  SentencePreviewTable,
} from '@/widgets/test-online';
import { useExamDetail } from '@/entities/test';
import { toVocabReviewItems } from '@/entities/test';
import { toSentencePreviewItems } from '@/pages/teacher/clinic-detail/model/mapper';

// 선생님이 학생이 풀게 될 시험을 미리 확인하는 페이지.
// examType이 'EXAMPLE'이면 sentence preview, 그 외엔 vocab preview를 사용한다.

export default function ExamPreviewPage() {
  const { examId: examIdParam } = useParams({ from: '/teacher_/exams/$examId/preview' });
  const { returnTo, examType } = useSearch({ from: '/teacher_/exams/$examId/preview' });
  const router = useRouter();

  const examId = Number(examIdParam);
  const { data: examDetail, isLoading } = useExamDetail(examId);

  const [currentPage, setCurrentPage] = useState(1);

  function handleExit() {
    if (returnTo) {
      router.history.replace(returnTo);
    } else {
      router.history.back();
    }
  }

  if (isLoading || !examDetail) {
    return (
      <div className="min-h-dvh bg-surface flex flex-col">
        <TestHeader onExit={handleExit} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const effectiveExamType: ExamType = examType ?? 'WORD';
  const isSentence = effectiveExamType === 'EXAMPLE';

  const vocabItems = !isSentence ? toVocabReviewItems(examDetail.items) : [];
  const sentenceItems = isSentence ? toSentencePreviewItems(examDetail.items) : [];
  const totalCount = isSentence ? sentenceItems.length : vocabItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const vocabPageItems = vocabItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const sentencePageItems = sentenceItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <TestHeader onExit={handleExit} />

      <div className="flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          {isSentence ? (
            <SentencePreviewTable items={sentencePageItems} />
          ) : (
            <VocabPreviewTable items={vocabPageItems} showSynonym={examDetail.includeSynonym} />
          )}

          <TestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
