type TestStatus = 'pending' | 'completed';

interface WrongWordTestRecord {
  id: string;
  date: string;
  items: number;
  score: string | null;
  status: TestStatus;
}

const MOCK_WRONG_WORDS = [
  { word: 'ambiguous', meaning: '모호한', wrongCount: 5, lastWrong: '26.04.10' },
  { word: 'contemplate', meaning: '심사숙고하다', wrongCount: 4, lastWrong: '26.04.09' },
  { word: 'ephemeral', meaning: '일시적인', wrongCount: 3, lastWrong: '26.04.08' },
  { word: 'inevitable', meaning: '불가피한', wrongCount: 3, lastWrong: '26.04.07' },
  { word: 'pragmatic', meaning: '실용적인', wrongCount: 2, lastWrong: '26.04.06' },
];

const MOCK_TEST_HISTORY: WrongWordTestRecord[] = [
  { id: '#WT-29384', date: 'Oct 26, 2023', items: 30, score: null, status: 'pending' },
  { id: '#WT-29381', date: 'Oct 24, 2023', items: 30, score: '28/30', status: 'completed' },
];

export function WrongWordBankTab() {
  const totalCount = MOCK_WRONG_WORDS.reduce((sum, w) => sum + w.wrongCount, 0);

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
          <button className="flex items-center gap-2 bg-primary hover:opacity-90 transition-opacity text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            Generate Wrong Word Test
          </button>
        </div>
      </div>

      {/* Wrong Word Test History Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 flex items-center gap-3 border-b border-outline/20">
          <span className="material-symbols-outlined text-primary">history</span>
          <h3 className="text-lg font-headline font-bold text-primary">Wrong Word Test History</h3>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr] px-8 py-3 border-b border-outline/10">
          {['Test ID', 'Date', 'Items', 'Score', 'Status', 'Actions'].map((col) => (
            <span
              key={col}
              className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest last:text-right"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        {MOCK_TEST_HISTORY.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr] px-8 py-5 border-b border-outline/10 last:border-none items-center"
          >
            <span className="text-sm font-bold text-primary">{row.id}</span>
            <span className="text-sm text-on-surface">{row.date}</span>
            <span className="text-sm text-on-surface-variant">{row.items} Items</span>
            <span
              className={`text-sm font-bold ${row.score ? 'text-success' : 'text-on-surface-variant/40'}`}
            >
              {row.score ?? '--'}
            </span>
            <div className="flex items-center justify-between">
              {row.status === 'pending' ? (
                <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-wide">
                  Pending
                </span>
              ) : (
                <span className="px-3 py-1 bg-success/5 border border-success/20 rounded-full text-[10px] font-bold text-success uppercase tracking-wide">
                  Completed
                </span>
              )}
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">print</span>
                </button>
                {row.status === 'pending' ? (
                  <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity">
                    Grade
                  </button>
                ) : (
                  <button className="px-4 py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors">
                    Edit
                  </button>
                )}
                <button className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* <div className="px-8 py-4 border-t border-outline/10 flex justify-center">
          <button className="text-sm font-bold text-primary hover:underline">
            View All History
          </button>
        </div> */}
      </div>
    </div>
  );
}
