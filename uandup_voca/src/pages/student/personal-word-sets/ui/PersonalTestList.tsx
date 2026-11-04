import { useNavigate } from '@tanstack/react-router';
import { TableContainer } from '@/shared/ui/TableContainer';
import { usePersonalTestExamList } from '@/entities/personal-test';
import type { PersonalTestExamRow, PersonalTestExamStatus } from '@/entities/personal-test';

interface Props {
  studentId: number;
}

const COLUMNS = ['Date', 'Word Set', 'Range', 'Test QTY', 'Score', 'Status', 'Actions'];

function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 학생의 개인 단어장 시험 목록 — 선생님이 만든 시험만 보인다(학생은 시험을 만들 수 없다).
// 응시는 선생님이 온라인 시작(IN_PROGRESS)한 뒤 1회만 가능 — 이미 응시했으면 잠근다(재응시 불가, 서버도 400).
// 시험이 하나도 없으면 목록 자체를 그리지 않는다 — 개인 단어장은 암기가 주 용도라 빈 표가 화면을 차지하지 않게.
export function PersonalTestList({ studentId }: Props) {
  const navigate = useNavigate();
  const { data: rows = [] } = usePersonalTestExamList(studentId);

  if (rows.length === 0) return null;

  function returnToCurrent() {
    return window.location.pathname + window.location.search;
  }

  function goTake(examId: number) {
    navigate({
      to: '/student/exams/$examId/take',
      params: { examId: String(examId) },
      search: { returnTo: returnToCurrent(), examType: 'PERSONAL_TEST' },
    });
  }

  function goReview(examId: number) {
    navigate({
      to: '/student/exams/$examId/review',
      params: { examId: String(examId) },
      search: { returnTo: returnToCurrent(), examType: 'PERSONAL_TEST' },
    });
  }

  function goWords(studySetId: number) {
    navigate({
      to: '/student/personal-test/$studySetId/words',
      params: { studySetId: String(studySetId) },
    });
  }

  return (
    <section className="mt-10 space-y-3">
      <div className="flex items-end gap-3">
        <h2 className="text-xl font-headline font-bold text-primary">Personal Tests</h2>
        <p className="text-xs text-on-surface-variant mb-0.5">
          Tests your teacher made from your word sets. Wrong answers go to your Review Deck.
        </p>
      </div>
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[11%]" />
              <col className="w-[20%]" />
              <col className="w-[11%]" />
              <col className="w-[9%]" />
              <col className="w-[9%]" />
              <col className="w-[14%]" />
              <col className="w-[26%]" />
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
              {rows.map((row) => (
                <PersonalTestListRow
                  key={row.examId}
                  row={row}
                  onTake={() => goTake(row.examId)}
                  onReview={() => goReview(row.examId)}
                  onWords={() => goWords(row.studySetId)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>
    </section>
  );
}

interface RowProps {
  row: PersonalTestExamRow;
  onTake: () => void;
  onReview: () => void;
  onWords: () => void;
}

function PersonalTestListRow({ row, onTake, onReview, onWords }: RowProps) {
  const isCompleted = row.status === 'PASSED' || row.status === 'FAILED';
  const scoreText =
    row.correctCount !== null && row.totalCount !== null
      ? `${row.correctCount}/${row.totalCount}`
      : `-/${row.questionCount}`;
  const scoreClass = isCompleted
    ? row.status === 'PASSED'
      ? 'text-success'
      : 'text-error'
    : 'text-on-surface-variant/40';
  const rangeText =
    row.rangeStart !== null && row.rangeEnd !== null ? `#${row.rangeStart}–#${row.rangeEnd}` : '-';
  const cellClass =
    'px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm border-r border-outline-variant/20';

  return (
    <tr>
      <td className={`${cellClass} text-on-surface`}>{formatDate(row.createdAt)}</td>
      <td className={`${cellClass} font-bold text-on-surface`}>
        <span className="truncate block">{row.personalWordSetName ?? '-'}</span>
      </td>
      <td className={`${cellClass} text-on-surface-variant`}>{rangeText}</td>
      <td className={`${cellClass} text-on-surface-variant`}>{row.questionCount}</td>
      <td className={`${cellClass} font-bold`}>
        <span className={scoreClass}>{scoreText}</span>
      </td>
      <td className="px-3 xl:px-4 py-3 xl:py-4 border-r border-outline-variant/20">
        <PersonalTestStudentStatusBadge status={row.status} />
      </td>
      <td className="px-3 xl:px-4 py-3 xl:py-4">
        <div className="flex items-center gap-1.5 xl:gap-2 justify-end">
          {row.status === 'IN_PROGRESS' ? (
            row.attempted ? (
              // 이미 응시함 — 나갔다 돌아와도 같은 시험은 다시 열리지 않는다
              <button
                disabled
                className="px-3 xl:px-4 py-1 xl:py-1.5 border border-slate-200 text-on-surface-variant/50 text-xs font-bold rounded-full cursor-not-allowed"
              >
                Attempted
              </button>
            ) : (
              <button
                onClick={onTake}
                className="px-3 xl:px-4 py-1 xl:py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                Start Test
              </button>
            )
          ) : isCompleted || row.status === 'SUBMITTED' ? (
            <button
              onClick={onReview}
              className="px-3 xl:px-4 py-1 xl:py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors"
            >
              View Results
            </button>
          ) : null}
          <button
            onClick={onWords}
            className="px-3 xl:px-4 py-1 xl:py-1.5 border bg-primary border-outline-variant/30 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            View Words
          </button>
        </div>
      </td>
    </tr>
  );
}

function PersonalTestStudentStatusBadge({ status }: { status: PersonalTestExamStatus }) {
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
          Passed
        </span>
      );
    case 'FAILED':
      return (
        <span className="px-3 py-1 bg-error/5 border border-error/20 rounded-full text-[10px] font-bold text-error uppercase tracking-wide">
          Failed
        </span>
      );
  }
}
