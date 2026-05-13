import { useState } from 'react';
import { useRouter, useParams } from '@tanstack/react-router';
import { MOCK_VOCAB_REVIEW_ITEMS, ITEMS_PER_PAGE } from '@/entities/test';
import { TestHeader, TestPagination, VocabPreviewTable } from '@/widgets/test-online';

// 선생님이 학생이 풀게 될 시험을 미리 확인하는 페이지.
// 학생 답 영역 없이 word/뜻/synonym만 단일 행으로 표시하는 VocabPreviewTable을 사용한다.
// Submit 버튼·경고 문구·ProgressPanel은 응시/채점 흐름에서만 의미 있으므로 여기서는 노출하지 않는다.
// 데이터는 이번 범위에선 mock 사용. 추후 examId로 실제 데이터 페칭 연동 예정.

export default function ExamPreviewPage() {
  const { examId } = useParams({ from: '/teacher_/exams/$examId/preview' });
  const router = useRouter();

  // examId는 향후 실제 API 연동 시 사용 — 현재는 mock 데이터.
  void examId;

  const [currentPage, setCurrentPage] = useState(1);

  const items = MOCK_VOCAB_REVIEW_ITEMS;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const pageItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TestHeader onExit={() => router.history.back()} />

      <div className="flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          <VocabPreviewTable items={pageItems} showSynonym />

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
