import { useNavigate } from '@tanstack/react-router';
import { PageTitle } from '@/shared/ui/PageTitle';
import { TableContainer } from '@/shared/ui/TableContainer';

type TestStatus = 'pending' | 'awaiting-test' | 'awaiting-grading' | 'completed' | 'fail';

interface WrongWordTestRecord {
  date: string;
  quantity: number;
  score: number | null;
  status: TestStatus;
}

const MOCK_TEST_HISTORY: WrongWordTestRecord[] = [
  { date: '2026.05.10', quantity: 30, score: null, status: 'awaiting-test' },
  { date: '2026.05.05', quantity: 30, score: 27, status: 'completed' },
  { date: '2026.05.01', quantity: 30, score: 25, status: 'completed' },
  { date: '2026.04.28', quantity: 30, score: 12, status: 'fail' },
  { date: '2026.04.25', quantity: 30, score: 28, status: 'completed' },
];

const COLUMNS = ['Date', 'Quantity', 'Score', 'Status', 'Actions'];

export function WrongWordBankPage() {
  const totalCount = 43;
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <PageTitle title="Wrong Word Bank" />
      {/* My Wrong Word Bank Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-b border-outline/20">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-headline font-extrabold text-primary">{totalCount}</span>
            <span className="text-md text-on-surface-variant/80">
              words you have answered incorrectly across all tests
            </span>
          </div>
          <button
            onClick={() => navigate({ to: '/student/wrong-word-list' })}
            className="flex items-center gap-1.5 bg-primary hover:opacity-90 transition-opacity text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/10"
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
                    className={`px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest ${i < COLUMNS.length - 1 ? 'border-r border-outline-variant/20' : ''} ${col === 'Actions' ? 'text-right' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {MOCK_TEST_HISTORY.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-4 text-sm text-on-surface border-r border-outline-variant/20">
                    {row.date}
                  </td>
                  <td className="px-4 py-4 text-sm text-on-surface-variant border-r border-outline-variant/20">
                    {row.quantity}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold border-r border-outline-variant/20">
                    <span
                      className={
                        row.status === 'fail'
                          ? 'text-error'
                          : row.score !== null
                            ? 'text-success'
                            : 'text-on-surface-variant/40'
                      }
                    >
                      {row.score !== null ? `${row.score}/${row.quantity}` : '--'}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-outline-variant/20">
                    {row.status === 'pending' ? (
                      <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-wide">
                        Pending
                      </span>
                    ) : row.status === 'awaiting-test' ? (
                      <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Awaiting Test
                      </span>
                    ) : row.status === 'awaiting-grading' ? (
                      <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Awaiting Grading
                      </span>
                    ) : row.status === 'fail' ? (
                      <span className="px-3 py-1 bg-error/5 border border-error/20 rounded-full text-[10px] font-bold text-error uppercase tracking-wide">
                        Fail
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-success/5 border border-success/20 rounded-full text-[10px] font-bold text-success uppercase tracking-wide">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {row.status === 'awaiting-test' ? (
                        <button
                          disabled
                          className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full opacity-40 cursor-not-allowed"
                        >
                          Start Test
                        </button>
                      ) : row.status === 'awaiting-grading' ? (
                        <button
                          disabled
                          className="px-4 py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full opacity-40 cursor-not-allowed"
                        >
                          View Results
                        </button>
                      ) : row.status === 'completed' || row.status === 'fail' ? (
                        <button className="px-4 py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors">
                          View Results
                        </button>
                      ) : null}{' '}
                      <button className="px-4 py-1.5 border bg-primary border-outline-variant/30 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity">
                        View Words
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>
    </div>
  );
}
