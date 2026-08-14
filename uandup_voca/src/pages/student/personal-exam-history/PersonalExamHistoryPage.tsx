import { useNavigate } from '@tanstack/react-router';
import { PageTitle } from '@/shared/ui/PageTitle';
import { TableContainer } from '@/shared/ui/TableContainer';
import { usePersonalExamList } from '@/entities/personal-exam';
import type { PersonalExamStatus } from '@/entities/personal-exam';
import type { WordTestType } from '@/entities/test';
import { useCurrentStudentId } from '@/entities/auth';

const COLUMNS = ['Type', 'Total', 'Score', 'Status', 'Actions'];

// PersonalExam은 ONLINE_STARTED 단계가 없다(생성 즉시 응시 가능) — READY 자체가 응시 가능 상태.
function isStartable(status: PersonalExamStatus): boolean {
  return status === 'READY';
}

function testTypeLabel(subType: WordTestType): string {
  return subType === 'word-to-meaning' ? 'Word → Meaning' : 'Meaning → Word';
}

// 개인단어장 시험 이력 페이지 — LevelTestPage/WrongWordBankPage와 동일한 "이력 테이블 +
// 결과보기 버튼" 패턴. PersonalWord는 study-set처럼 개별 단어 하위집합이 없는 플랫 리스트라
// (예: review-deck의 wrong-bank) 행마다 "View Words"를 두지 않고 상단에 한 번만 둔다.
export function PersonalExamHistoryPage() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;
  const { data: rows = [] } = usePersonalExamList(studentId);

  function returnToCurrent() {
    return window.location.pathname + window.location.search;
  }

  function goTake(personalExamId: number) {
    navigate({
      to: '/student/exams/$examId/take',
      params: { examId: String(personalExamId) },
      search: { returnTo: returnToCurrent(), examType: 'PERSONAL' },
    });
  }

  function goReview(personalExamId: number) {
    navigate({
      to: '/student/exams/$examId/review',
      params: { examId: String(personalExamId) },
      search: { returnTo: returnToCurrent(), examType: 'PERSONAL' },
    });
  }

  function goWords() {
    navigate({ to: '/student/personal-exams/words' });
  }

  return (
    <div className="space-y-4">
      <PageTitle title="Personal Words" />

      {/* My Personal Words Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-5 xl:px-8 py-4 xl:py-6 flex items-center justify-between border-b border-outline/20">
          <span className="text-xs xl:text-base text-on-surface-variant/80">
            Words your teacher has personally assigned to you
          </span>
          <button
            onClick={goWords}
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
                  const isCompleted = row.status === 'COMPLETED';
                  const scoreText =
                    isCompleted && row.correctCount !== null
                      ? `${row.correctCount}/${row.totalCount}`
                      : `-/${row.totalCount}`;
                  const scoreClass = isCompleted
                    ? row.isPassed
                      ? 'text-success'
                      : 'text-error'
                    : 'text-on-surface-variant/40';

                  return (
                    <tr key={row.personalExamId}>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-on-surface border-r border-outline-variant/20">
                        {testTypeLabel(row.subType)}
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-on-surface-variant border-r border-outline-variant/20">
                        {row.totalCount}
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm font-bold border-r border-outline-variant/20">
                        <span className={scoreClass}>{scoreText}</span>
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 border-r border-outline-variant/20">
                        <StatusBadge status={row.status} isPassed={row.isPassed} />
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4">
                        <div className="flex items-center gap-1.5 xl:gap-2 justify-end">
                          {isStartable(row.status) ? (
                            <button
                              onClick={() => goTake(row.personalExamId)}
                              className="px-3 xl:px-4 py-1 xl:py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
                            >
                              Start Test
                            </button>
                          ) : row.status === 'SUBMITTED' || isCompleted ? (
                            <button
                              onClick={() => goReview(row.personalExamId)}
                              className="px-3 xl:px-4 py-1 xl:py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors"
                            >
                              View Results
                            </button>
                          ) : null}
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

function StatusBadge({
  status,
  isPassed,
}: {
  status: PersonalExamStatus;
  isPassed: boolean | null;
}) {
  if (status === 'COMPLETED') {
    return isPassed ? (
      <span className="px-3 py-1 bg-success/5 border border-success/20 rounded-full text-[10px] font-bold text-success uppercase tracking-wide">
        Passed
      </span>
    ) : (
      <span className="px-3 py-1 bg-error/5 border border-error/20 rounded-full text-[10px] font-bold text-error uppercase tracking-wide">
        Fail
      </span>
    );
  }
  switch (status) {
    case 'READY':
      return (
        <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          Ready to Start
        </span>
      );
    case 'SUBMITTED':
      return (
        <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-bold text-blue-500 uppercase tracking-wide">
          Awaiting Grading
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          Cancelled
        </span>
      );
  }
}
