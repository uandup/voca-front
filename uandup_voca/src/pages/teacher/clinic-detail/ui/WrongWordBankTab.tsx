import { useState } from 'react';
import { TableContainer } from '@/shared/ui/TableContainer';
import { NumberInput } from '@/shared/ui/NumberInput';

type TestStatus = 'pending' | 'completed' | 'fail';

interface WrongWordTestRecord {
  date: string;
  quantity: number;
  score: number | null;
  status: TestStatus;
}

const MOCK_TEST_HISTORY: WrongWordTestRecord[] = [
  { date: '26.04.25', quantity: 30, score: null, status: 'pending' },
  { date: '26.04.28', quantity: 30, score: 12, status: 'fail' },
  { date: '26.05.01', quantity: 30, score: 28, status: 'completed' },
];

const COLUMNS = ['Date', 'QTY', 'Score', 'Status', 'Actions'];

export function WrongWordBankTab() {
  const totalCount = 124;
  const [qty, setQty] = useState('10');

  return (
    <div className="space-y-4">
      {/* Error Database Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-b border-outline/20">
          <div>
            <h3 className="text-xl font-headline font-bold text-primary">Error Database</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-on-surface-variant">
                Total {totalCount} incorrect words tracked
              </p>
              <button className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  open_in_new
                </span>
                View Error Word List
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-outline/30 rounded-xl overflow-hidden">
              <span className="px-3 py-4 text-xs font-bold text-on-surface-variant bg-surface-container-highest/40 border-r border-outline/20 whitespace-nowrap">
                QTY
              </span>
              <NumberInput
                value={qty}
                onChange={setQty}
                min={1}
                max={totalCount}
                className="w-16 px-3 py-3  border text-sm font-bold text-on-surface text-center border-none rounded-none"
              />
            </div>
            <button className="flex items-center gap-2 bg-primary hover:opacity-90 transition-opacity text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/10">
              Generate Test
            </button>
          </div>
        </div>
      </div>

      {/* Wrong Word Test History Table */}
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[10%]" />
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
                          <button className="px-4 py-1.5 border border-outline-variant/30 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 hover:text-primary transition-colors">
                            Preview
                          </button>
                          <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity">
                            Start Test
                          </button>
                          <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity">
                            Grade
                          </button>
                        </>
                      ) : (
                        <button className="px-4 py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors">
                          View Results
                        </button>
                      )}
                      {/* <button className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button> */}
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
