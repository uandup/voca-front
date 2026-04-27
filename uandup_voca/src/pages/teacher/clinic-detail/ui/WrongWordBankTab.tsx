import { useState } from 'react';
import { TableContainer } from '@/shared/ui/TableContainer';
import { NumberInput } from '@/shared/ui/NumberInput';

type TestStatus = 'pending' | 'completed' | 'fail';
type TestType = 'Meaning to Word' | 'Word to Meaning';

interface WrongWordTestRecord {
  date: string;
  quantity: number;
  score: number | null;
  status: TestStatus;
}

interface WrongWordConfig {
  qty: string;
  testType: TestType;
  includeSynonyms: boolean;
}

const MOCK_TEST_HISTORY: WrongWordTestRecord[] = [
  { date: '2026.04.25', quantity: 30, score: null, status: 'pending' },
  { date: '2026.04.28', quantity: 30, score: 12, status: 'fail' },
  { date: '2026.05.01', quantity: 30, score: 28, status: 'completed' },
];

const COLUMNS = ['Date', 'QTY', 'Score', 'Status', 'Actions'];
const TEST_TYPE_OPTIONS: TestType[] = ['Meaning to Word', 'Word to Meaning'];

export function WrongWordBankTab() {
  const totalCount = 124;
  const [config, setConfig] = useState<WrongWordConfig>({
    qty: '10',
    testType: 'Meaning to Word',
    includeSynonyms: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  const inputClass = `w-full text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed transition-colors ${
    isEditing
      ? 'border-primary/30 bg-white text-on-surface'
      : 'border-slate-200 bg-slate-100 text-slate-500'
  }`;

  return (
    <div className="space-y-4">
      {/* Wrong Database Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-4 border-b border-outline/20 flex items-center justify-between">
          <div className="flex items-end gap-3">
            <h3 className="text-xl font-headline font-bold text-primary">Wrong Word Database</h3>
            <p className="text-xs text-on-surface-variant mb-0.5">
              Total {totalCount} incorrect words tracked
            </p>
          </div>
          {/* flex items-center gap-1.5  text-sm */}
          <button className="flex items-center rounded-lg gap-0.5 px-3 py-2.5 text-xs shadow-lg shadow-primary/10 font-bold bg-primary hover:opacity-90 transition-opacity text-white">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              open_in_new
            </span>
            View Wrong Word List
          </button>
        </div>

        {/* Test Configuration Section */}
        <div className="px-8 py-5 flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <div className="grid grid-cols-3 gap-4 flex-1 max-w-lg">
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Test Type
                </label>
                <select
                  value={config.testType}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, testType: e.target.value as TestType }))
                  }
                  disabled={!isEditing}
                  className={inputClass}
                >
                  {TEST_TYPE_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Quantity
                </label>
                <NumberInput
                  value={config.qty}
                  onChange={(v) => setConfig((prev) => ({ ...prev, qty: v }))}
                  min={1}
                  max={totalCount}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Include Synonyms
                </label>
                <label
                  className={`relative inline-flex items-center mt-1 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                >
                  <input
                    type="checkbox"
                    checked={config.includeSynonyms}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, includeSynonyms: e.target.checked }))
                    }
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-5 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {isEditing && (
                <p className="text-xs text-error">
                  Please apply the configuration before generating.
                </p>
              )}
              <button
                onClick={() => setIsEditing((v) => !v)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity"
              >
                {isEditing ? 'Apply' : 'Edit'}
              </button>
              <button
                disabled={isEditing}
                className="flex items-center gap-2 bg-primary hover:opacity-90 transition-opacity text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-lg shadow-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Generate Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wrong Word Test History Table */}
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[44%]" />
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
                          <button className="px-4 py-1.5 border border-primary/30 text-primary text-xs font-bold rounded-full hover:bg-primary/5 transition-colors">
                            Grade Online
                          </button>
                          <button className="px-4 py-1.5 border border-primary/30 text-primary text-xs font-bold rounded-full hover:bg-primary/5 transition-colors">
                            Grade Offline
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
