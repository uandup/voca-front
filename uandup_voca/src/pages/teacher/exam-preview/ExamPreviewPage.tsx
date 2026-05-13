import { useState } from 'react';
import { useRouter, useParams, useSearch } from '@tanstack/react-router';
import { ITEMS_PER_PAGE } from '@/entities/test';
import { TestHeader, TestPagination, VocabPreviewTable } from '@/widgets/test-online';
import { useExamDetail } from '@/pages/teacher/clinic-detail/model/hooks/useExamDetail';
import { toVocabReviewItems } from '@/pages/teacher/clinic-detail/model/mapper';

// 선생님이 학생이 풀게 될 시험을 미리 확인하는 페이지.
// 학생 답 영역 없이 word/뜻/synonym만 단일 행으로 표시하는 VocabPreviewTable을 사용한다.

export default function ExamPreviewPage() {
  const { examId: examIdParam } = useParams({ from: '/teacher_/exams/$examId/preview' });
  const { returnTo } = useSearch({ from: '/teacher_/exams/$examId/preview' });
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
      <div className="min-h-screen bg-surface flex flex-col">
        <TestHeader onExit={handleExit} />
        <div className="flex-1 flex items-center justify-center text-on-surface-variant">
          Loading...
        </div>
      </div>
    );
  }

  const items = toVocabReviewItems(examDetail.items);
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const pageItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TestHeader onExit={handleExit} />

      <div className="flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          <VocabPreviewTable items={pageItems} showSynonym={examDetail.includeSynonym} />

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
