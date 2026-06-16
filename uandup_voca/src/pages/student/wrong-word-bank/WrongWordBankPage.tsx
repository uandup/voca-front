import { useNavigate } from '@tanstack/react-router';
import { PageTitle } from '@/shared/ui/PageTitle';
import { TableContainer } from '@/shared/ui/TableContainer';
import { useReviewDeckCount, useReviewDeckExamList } from '@/entities/review-deck';
import type { ReviewDeckExamStatus } from '@/entities/review-deck';
import { useCurrentStudentId } from '@/entities/auth';

const COLUMNS = ['Date', 'Quantity', 'Score', 'Status', 'Actions'];

// 활성 시험으로 분류되는 status — student는 ONLINE_STARTED/IN_PROGRESS일 때만 응시 가능.
// READY는 선생님이 시작 전, SUBMITTED는 채점 대기.
function isStartable(status: ReviewDeckExamStatus): boolean {
  return status === 'IN_PROGRESS';
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function WrongWordBankPage() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;
  const { data: totalCount = 0 } = useReviewDeckCount(studentId);
  const { data: rows = [] } = useReviewDeckExamList(studentId);

  function returnToCurrent() {
    return window.location.pathname + window.location.search;
  }

  function goTake(examId: number) {
    navigate({
      to: '/student/exams/$examId/take',
      params: { examId: String(examId) },
      search: { returnTo: returnToCurrent(), examType: 'REVIEW_DECK' },
    });
  }

  function goReview(examId: number) {
    navigate({
      to: '/student/exams/$examId/review',
      params: { examId: String(examId) },
      search: { returnTo: returnToCurrent(), examType: 'REVIEW_DECK' },
    });
  }

  function goWords(studySetId: number) {
    navigate({
      to: '/student/review-deck/$studySetId/words',
      params: { studySetId: String(studySetId) },
    });
  }

  return (
    <div className="space-y-4">
      <PageTitle title="Review Deck" />
      {/* My Review Deck Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-5 xl:px-8 py-4 xl:py-6 flex items-center justify-between border-b border-outline/20">
          <div className="flex items-baseline gap-2 xl:gap-3">
            <span className="text-2xl xl:text-4xl font-headline font-extrabold text-primary">
              {totalCount}
            </span>
            <span className="text-xs xl:text-base text-on-surface-variant/80">
              words you have answered incorrectly across all tests
            </span>
          </div>
          <button
            onClick={() => navigate({ to: '/student/review-deck/words' })}
            className="flex items-center gap-1.5 bg-primary hover:opacity-90 transition-opacity text-white px-3 xl:px-5 py-2 xl:py-3 rounded-xl font-bold text-xs xl:text-sm shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              open_in_new
            </span>
            View Word List
          </button>
        </div>
      </div>

      {/* Test History Table */}
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[30%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-container-highest/30">
                {COLUMNS.map((col, i) => (
                  <th
                    key={col}
                    className={`px-3 xl:px-4 py-3 xl:py-4 text-[10px] xl:text-xs font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap ${i < COLUMNS.length - 1 ? 'border-r border-outline-variant/20' : ''} ${col === 'Actions' ? 'text-right' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-12 text-center text-sm text-on-surface-variant"
                  >
                    No tests yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const isCompleted = row.status === 'PASSED' || row.status === 'FAILED';
                  const scoreText =
                    row.correctCount !== null && row.totalCount !== null
                      ? `${row.correctCount}/${row.totalCount}`
                      : `-/${row.wordCount}`;
                  const scoreClass = isCompleted
                    ? row.status === 'PASSED'
                      ? 'text-success'
                      : 'text-error'
                    : 'text-on-surface-variant/40';

                  return (
                    <tr key={row.examId}>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-on-surface border-r border-outline-variant/20">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-on-surface-variant border-r border-outline-variant/20">
                        {row.wordCount}
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm font-bold border-r border-outline-variant/20">
                        <span className={scoreClass}>{scoreText}</span>
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 border-r border-outline-variant/20">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4">
                        <div className="flex items-center gap-1.5 xl:gap-2 justify-end">
                          {isStartable(row.status) ? (
                            <button
                              onClick={() => goTake(row.examId)}
                              className="px-3 xl:px-4 py-1 xl:py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
                            >
                              Start Test
                            </button>
                          ) : isCompleted ? (
                            <button
                              onClick={() => goReview(row.examId)}
                              className="px-3 xl:px-4 py-1 xl:py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors"
                            >
                              View Results
                            </button>
                          ) : row.status === 'SUBMITTED' ? (
                            <button
                              onClick={() => goReview(row.examId)}
                              className="px-3 xl:px-4 py-1 xl:py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors"
                            >
                              View Results
                            </button>
                          ) : null}
                          <button
                            onClick={() => goWords(row.studySetId)}
                            className="px-3 xl:px-4 py-1 xl:py-1.5 border bg-primary border-outline-variant/30 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
                          >
                            View Words
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </TableContainer>
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewDeckExamStatus }) {
  switch (status) {
    case 'READY':
      return (
        <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          Awaiting Test
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-wide">
          In Progress
        </span>
      );
    case 'SUBMITTED':
      return (
        <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-bold text-blue-500 uppercase tracking-wide">
          Awaiting Grading
        </span>
      );
    case 'PASSED':
      return (
        <span className="px-3 py-1 bg-success/5 border border-success/20 rounded-full text-[10px] font-bold text-success uppercase tracking-wide">
          Completed
        </span>
      );
    case 'FAILED':
      return (
        <span className="px-3 py-1 bg-error/5 border border-error/20 rounded-full text-[10px] font-bold text-error uppercase tracking-wide">
          Fail
        </span>
      );
  }
}
