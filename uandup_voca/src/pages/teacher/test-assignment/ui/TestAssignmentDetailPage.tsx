import { PageTitle } from '@/shared/ui/PageTitle';

type TestStatus = 'Completed' | 'Pending';

interface TestRecord {
  id: string;
  date: string;
  level: number;
  score: string;
  status: TestStatus;
}

const mockTestHistory: TestRecord[] = [
  {
    id: '#TX-8821',
    date: 'Oct 24, 2023',
    level: 1,
    score: '98/100',
    status: 'Completed',
  },
  {
    id: '#TX-8794',
    date: 'Oct 18, 2023',
    level: 1,
    score: '92/100',
    status: 'Completed',
  },
  {
    id: '#TX-8710',
    date: 'Oct 12, 2023',
    level: 1,
    score: '—',
    status: 'Pending',
  },
  {
    id: '#TX-8655',
    date: 'Oct 05, 2023',
    level: 1,
    score: '100/100',
    status: 'Completed',
  },
];

const levelProgress = [
  { label: 'Level 1 Progress', value: '120/1040' },
  { label: 'Level 2 Progress', value: '150/1040' },
  { label: 'Level 3 Progress', value: '180/1040' },
  { label: 'Level 4 Progress', value: '0/1040' },
];

export function TestAssignmentDetailPage() {
  return (
    <main>
      <div>
        <PageTitle title="Test Assignment" />

        {/* Student Profile Header Card */}
        <section className="mb-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-primary/5">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-headline text-3xl font-bold text-primary-container">
                Julianna De-Vries
              </h3>
              <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full">
                Grade 11-B
              </span>
            </div>
            <p className="text-on-surface-variant font-medium mb-6">
              Advanced Vocabulary Track • ID: 29485-JDV
            </p>
            <div className="grid grid-cols-4 gap-4">
              {levelProgress.map((item) => (
                <div
                  key={item.label}
                  className="bg-surface-container-low px-4 py-4 rounded-lg border border-primary/5"
                >
                  <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">
                    {item.label}
                  </span>
                  <span className="text-primary-container font-bold text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Assignment Bar */}
        <section className="mb-12">
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-6 border border-primary/10">
            <div className="flex items-center gap-4 flex-grow">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary-container whitespace-nowrap">
                  Difficulty:
                </span>
                <div className="flex bg-surface-container-low p-1 rounded-lg">
                  {['Level 1', 'Level 2', 'Level 3', 'Level 4'].map((lvl, i) => (
                    <button
                      key={lvl}
                      className={
                        i === 0
                          ? 'px-4 py-1.5 text-xs font-bold rounded-md bg-primary-container text-white shadow-sm transition-all'
                          : 'px-4 py-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-all'
                      }
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <label
                  className="text-sm font-bold text-primary-container whitespace-nowrap"
                  htmlFor="words_input"
                >
                  Quantity:
                </label>
                <input
                  id="words_input"
                  className="w-32 bg-surface-container-low border-none rounded-lg py-1.5 pl-3 pr-3 text-xs font-bold text-primary-container focus:ring-1 focus:ring-primary/20"
                  type="number"
                  defaultValue={25}
                />
              </div>
            </div>
            <button className="bg-primary-container hover:opacity-90 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-md">
              <span className="material-symbols-outlined text-lg">send</span>
              Assign
            </button>
          </div>
        </section>

        {/* Test History */}
        <div>
          {/* Tab Nav */}
          <div className="mb-6">
            <div className="bg-surface-container-low p-1.5 rounded-xl inline-flex items-center gap-1 shadow-inner border border-outline-variant/20">
              {['Word Test', 'Example Sentence Test', 'Review Test'].map((tab, i) => (
                <button
                  key={tab}
                  className={
                    i === 0
                      ? 'px-8 py-2.5 bg-white text-primary rounded-lg shadow-sm font-bold text-sm transition-all border border-blue-100/50'
                      : 'px-8 py-2.5 text-on-surface-variant hover:text-primary font-semibold text-sm transition-all'
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-8 border border-primary/5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  {['TEST ID', 'DATE', 'DIFFICULTY', 'SCORE', 'STATUS', 'ACTIONS'].map((col) => (
                    <th
                      key={col}
                      className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant ${col === 'ACTIONS' ? 'text-right' : 'text-left'}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {mockTestHistory.map((record) => (
                  <tr key={record.id} className="group hover:bg-surface-bright transition-all">
                    <td className="px-6 py-5">
                      <span className="font-headline font-bold text-primary-container">
                        {record.id}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">{record.date}</td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-primary-container">
                        Level {record.level}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-headline font-bold text-primary-container">
                      {record.score}
                    </td>
                    <td className="px-6 py-5">
                      {record.status === 'Completed' ? (
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase px-2 py-1 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-extrabold uppercase px-2 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-1.5 text-on-surface-variant hover:text-primary-container transition-colors">
                          <span className="material-symbols-outlined text-xl">print</span>
                        </button>
                        <button className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                        {record.status === 'Completed' ? (
                          <button className="ml-2 bg-primary-container/10 text-primary-container w-20 h-8 rounded-md text-xs font-bold hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                          </button>
                        ) : (
                          <button className="ml-2 bg-primary-container text-white w-20 h-8 rounded-md text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">fact_check</span>
                            Grade
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
