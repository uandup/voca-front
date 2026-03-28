import { PageTitle } from "@/shared/ui/PageTitle";

type TestStatus = "Completed" | "Pending";

interface TestRecord {
  id: string;
  date: string;
  level: number;
  score: string;
  status: TestStatus;
}

const mockRecords: TestRecord[] = [
  {
    id: "#TX-8821",
    date: "Oct 24, 2023",
    level: 1,
    score: "98/100",
    status: "Completed",
  },
  {
    id: "#TX-8710",
    date: "Oct 12, 2023",
    level: 1,
    score: "—",
    status: "Pending",
  },
  {
    id: "#TX-8655",
    date: "Oct 05, 2023",
    level: 1,
    score: "100/100",
    status: "Completed",
  },
];

const statCards = [
  { label: "Ungraded Word Tests", count: "12" },
  { label: "Ungraded Example Tests", count: "08" },
  { label: "Ungraded Review Tests", count: "05" },
];

const tabs = ["Word Test", "Example Sentence Test", "Review Test"];

export function TestGradingPage() {
  return (
    <main>
      <div className="space-y-8">
        <PageTitle title="Test Grading" />

        {/* Stats Header */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-primary/5"
            >
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-1.5">
                {card.label}
              </p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline text-3xl font-extrabold text-primary">
                  {card.count}
                </h3>
                <span className="text-tertiary font-extrabold text-[10px] uppercase bg-tertiary-fixed px-2 py-1 rounded-full">
                  Requires Action
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <div className="bg-surface-container-low p-1.5 rounded-xl inline-flex items-center gap-1 shadow-inner border border-outline-variant/20">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  className={
                    i === 0
                      ? "px-8 py-2.5 bg-white text-primary rounded-lg shadow-sm font-bold text-sm transition-all border border-blue-100/50"
                      : "px-8 py-2.5 text-on-surface-variant hover:text-primary font-semibold text-sm transition-all"
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-white border border-outline-variant/30 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-sm">
                  filter_list
                </span>
                Filter
              </button>
              <button className="flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-white border border-outline-variant/30 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                Export
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-primary/5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    {[
                      "TEST ID",
                      "DATE",
                      "DIFFICULTY",
                      "SCORE",
                      "STATUS",
                      "ACTIONS",
                    ].map((col) => (
                      <th
                        key={col}
                        className={`px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider ${col === "ACTIONS" ? "text-right" : "text-left"}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {mockRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="group hover:bg-surface-bright transition-all"
                    >
                      <td className="px-6 py-5">
                        <span className="font-headline font-bold text-primary-container">
                          {record.id}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-on-surface-variant">
                          {record.date}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-primary">
                          Level {record.level}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-headline font-bold text-primary">
                          {record.score}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {record.status === "Completed" ? (
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
                          <button
                            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                            title="Print Record"
                          >
                            <span className="material-symbols-outlined text-xl">
                              print
                            </span>
                          </button>
                          <button className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-xl">
                              delete
                            </span>
                          </button>
                          {record.status === "Completed" ? (
                            <button className="ml-2 bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                edit
                              </span>
                              Edit
                            </button>
                          ) : (
                            <button className="ml-2 bg-primary text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1 shadow-sm">
                              <span className="material-symbols-outlined text-sm">
                                fact_check
                              </span>
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
            <div className="p-4 bg-surface-container-low text-center">
              <button className="text-xs font-bold text-primary flex items-center justify-center gap-2 hover:underline w-full">
                Load 20 More Records
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
