import { TableContainer } from "@/shared/ui/TableContainer";
import { AssignedLevelBlocks } from "@/entities/vocab";

type TestType = "Word" | "Sentence" | "Review";
type TestStatus = "Pending" | "Graded";

export interface WordTest {
  id: string;
  assignedAt: string;
  type: TestType;
  levels: (1 | 2 | 3 | 4)[];
  quantity: number;
  status: TestStatus;
  score?: string;
}

const TEST_TYPE_STYLES: Record<TestType, string> = {
  Word: "bg-primary/10 text-primary",
  Sentence: "bg-secondary-container text-on-secondary-container",
  Review: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

export function WordTestTable({ tests }: { tests: WordTest[] }) {
  return (
    <TableContainer>
      <div className="flex flex-col h-95">
        {/* 헤더 — 고정 */}
        <table className="w-full border-collapse table-fixed shrink-0">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[18%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
            <col className="w-[22%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface-container-low">
              {[
                "TEST ID",
                "ASSIGNED",
                "TYPE",
                "LEVEL",
                "SCORE",
                "STATUS",
                "ACTIONS",
              ].map((col) => (
                <th
                  key={col}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant ${col === "ACTIONS" ? "text-right" : "text-left"}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        {/* 바디 — 스크롤 */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-track]:bg-transparent">
          {tests.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-on-surface-variant/50 font-medium">
              배정된 시험이 없습니다.
            </div>
          ) : (
            <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[18%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[22%]" />
              </colgroup>
              <tbody>
                {tests.map((test) => (
                  <tr
                    key={test.id}
                    className="group hover:bg-surface-bright transition-all border-b border-surface-container"
                  >
                    <td className="px-6 py-5">
                      <span className="font-headline font-bold text-primary-container">
                        {test.id}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {test.assignedAt}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-full ${TEST_TYPE_STYLES[test.type]}`}
                      >
                        {test.type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <AssignedLevelBlocks levels={test.levels} />
                    </td>
                    <td className="px-6 py-5 font-headline font-bold text-primary-container">
                      {test.score ?? "—"}
                    </td>
                    <td className="px-6 py-5">
                      {test.status === "Graded" ? (
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase px-2 py-1 rounded-full">
                          Graded
                        </span>
                      ) : (
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-extrabold uppercase px-2 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-on-surface-variant hover:text-primary-container transition-colors">
                          <span className="material-symbols-outlined text-xl">
                            print
                          </span>
                        </button>
                        {test.status === "Graded" ? (
                          <button className="ml-2 bg-primary-container/10 text-primary-container w-20 h-8 rounded-md text-xs font-bold hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              edit
                            </span>
                            Edit
                          </button>
                        ) : (
                          <button className="ml-2 bg-primary-container text-white w-20 h-8 rounded-md text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1">
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
          )}
        </div>
      </div>
    </TableContainer>
  );
}
