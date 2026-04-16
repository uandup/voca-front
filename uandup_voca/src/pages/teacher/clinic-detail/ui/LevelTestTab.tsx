import { useState } from 'react';
import type { Vocab } from '@/entities/vocab/types/vocab';

type DifficultyLevel = Vocab['difficultyLevel'];
type TestStatus = 'pending' | 'completed';

interface LevelTestRecord {
  id: string;
  date: string;
  level: DifficultyLevel;
  items: number;
  score: string | null;
  status: TestStatus;
}

const MOCK_HISTORY: LevelTestRecord[] = [
  { id: '#LT-29384', date: 'Oct 26, 2023', level: 4, items: 100, score: null, status: 'pending' },
  {
    id: '#LT-29381',
    date: 'Oct 24, 2023',
    level: 4,
    items: 50,
    score: '92/100',
    status: 'completed',
  },
  {
    id: '#LT-29155',
    date: 'Oct 12, 2023',
    level: 3,
    items: 100,
    score: '98/100',
    status: 'completed',
  },
];

export function LevelTestTab() {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>(4);
  const [numQuestions, setNumQuestions] = useState(100);

  return (
    <div className="space-y-4">
      {/* Generator Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 pt-6">
          <h3 className="text-lg font-headline font-bold text-primary">Level Test Generator</h3>
        </div>
        <div className="px-8 py-6 flex items-end gap-6">
          {/* Level Selector */}
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
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-32 text-sm font-bold border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="self-stretch w-px bg-slate-200" />

          <button className="flex items-center gap-2 bg-primary hover:opacity-90 transition-opacity text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/10 whitespace-nowrap">
            Generate Level Test
          </button>
        </div>
      </div>

      {/* History Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        {/* History Header */}
        <div className="px-8 py-6 flex items-center gap-3 border-b border-outline/20">
          <span className="material-symbols-outlined text-primary">history</span>
          <h3 className="text-lg font-headline font-bold text-primary">Level Test History</h3>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr_1.5fr] px-8 py-3 border-b border-outline/10">
          {['Test ID', 'Date', 'Level', 'Items', 'Score', 'Status', 'Actions'].map((col) => (
            <span
              key={col}
              className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest last:text-right"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        {MOCK_HISTORY.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr_1.5fr] px-8 py-5 border-b border-outline/10 last:border-none items-center"
          >
            <span className="text-sm font-bold text-primary">{row.id}</span>
            <span className="text-sm text-on-surface">{row.date}</span>
            <span>
              <span className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-on-surface-variant">
                Level {row.level}
              </span>
            </span>
            <span className="text-sm text-on-surface-variant">{row.items} Items</span>
            <span
              className={`text-sm font-bold ${row.score ? 'text-success' : 'text-on-surface-variant/40'}`}
            >
              {row.score ?? '--'}
            </span>
            <span>
              {row.status === 'pending' ? (
                <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-wide">
                  Pending
                </span>
              ) : (
                <span className="px-3 py-1 bg-success/5 border border-success/20 rounded-full text-[10px] font-bold text-success uppercase tracking-wide">
                  Completed
                </span>
              )}
            </span>
            <div className="flex items-center justify-end gap-2">
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
        ))}

        {/* Footer */}
        {/* <div className="px-8 py-4 border-t border-outline/10 flex justify-center">
          <button className="text-sm font-bold text-primary hover:underline">
            View All History
          </button>
        </div> */}
      </div>
    </div>
  );
}
