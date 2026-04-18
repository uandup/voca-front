import { useState } from 'react';
import type { Vocab } from '@/entities/vocab/types/vocab';
import { TableContainer } from '@/shared/ui/TableContainer';
import { NumberInput } from '@/shared/ui/NumberInput';
import { AssignedLevelBlocks } from '@/entities/vocab/ui/AssignedLevelBlocks';

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

export function LevelTestTab() {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>(4);
  const [qty, setQty] = useState('100');

  return (
    <div className="space-y-4">
      {/* Generator Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 flex items-end gap-6">
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
              Select Target Level
            </p>
            <div className="flex gap-3">
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as DifficultyLevel[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => setSelectedLevel(lv)}
                  className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all ${
                    selectedLevel === lv
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 bg-white text-on-surface-variant hover:border-primary/40'
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>

          <div className="self-stretch w-px bg-slate-200" />

          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
              Quantity
            </p>
            <div className="flex items-center border border-outline/30 rounded-xl overflow-hidden">
              <NumberInput
                value={qty}
                onChange={setQty}
                min={1}
                className="w-20 px-3 py-3 text-sm font-bold text-on-surface text-center border-none rounded-none"
              />
            </div>
          </div>

          <div className="self-stretch w-px bg-slate-200" />

          <button className="flex items-center gap-2 bg-primary hover:opacity-90 transition-opacity text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/10 whitespace-nowrap">
            Generate Level Test
          </button>
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
