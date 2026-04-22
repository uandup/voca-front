import { useNavigate } from '@tanstack/react-router';
import type { Vocab } from '@/entities/vocab/types/vocab';
import { TableContainer } from '@/shared/ui/TableContainer';
import { AssignedLevelBlocks } from '@/entities/vocab/ui/AssignedLevelBlocks';
import { PageTitle } from '@/shared/ui/PageTitle';

type DifficultyLevel = Vocab['difficultyLevel'];
type TestStatus = 'pending' | 'completed' | 'fail';

interface LevelTestRecord {
  date: string;
  level: DifficultyLevel;
  quantity: number;
  score: number | null;
  status: TestStatus;
}

const MOCK_HISTORY: LevelTestRecord[] = [
  { date: '2026.04.25', level: 4, quantity: 100, score: null, status: 'pending' },
  { date: '2026.04.24', level: 4, quantity: 50, score: 42, status: 'fail' },
  { date: '2026.04.12', level: 3, quantity: 100, score: 98, status: 'completed' },
];

const COLUMNS = ['Date', 'Level', 'QTY', 'Score', 'Status', 'Actions'];

const ASSIGNED_WORD_COUNT = 100; // TODO: API 연동
const ASSIGNED_LEVEL = 4; // TODO: API 연동

export function LevelTestPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <PageTitle title="Level Test" />
      {/* Assigned Words Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-b border-outline/20">
          {ASSIGNED_WORD_COUNT > 0 ? (
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-headline font-extrabold text-primary">
                Level {ASSIGNED_LEVEL}
              </span>
              <span className="text-on-surface-variant/30 text-4xl font-light">·</span>
              <span className="text-4xl font-headline font-extrabold text-primary">
                {ASSIGNED_WORD_COUNT}
              </span>
              <span className="text-sm text-on-surface-variant/80">
                words have been assigned for your level test
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-headline font-extrabold text-on-surface-variant/30">
                0
              </span>
              <span className="text-sm text-on-surface-variant/80">
                No words have been assigned yet
              </span>
            </div>
          )}
          {ASSIGNED_WORD_COUNT > 0 && (
            <button
              onClick={() => navigate({ to: '/student/level-word-list' })}
              className="flex items-center gap-1.5 bg-primary hover:opacity-90 transition-opacity text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/10"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                open_in_new
              </span>
              View Word List
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[32%]" />
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
              {MOCK_HISTORY.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-4 text-sm text-on-surface border-r border-outline-variant/20">
                    {row.date}
                  </td>
                  <td className="px-4 py-4 border-r border-outline-variant/20">
                    <AssignedLevelBlocks level={row.level} />
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
                      {row.status === 'pending' ? (
                        <>
                          <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity">
                            Start Test
                          </button>
                        </>
                      ) : (
                        <button className="px-4 py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors">
                          View Results
                        </button>
                      )}
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
