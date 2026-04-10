import { TableContainer } from '@/shared/ui/TableContainer';
import { AssignedLevelBlocks } from '@/entities/vocab';

export interface ReviewScore {
  value: string;
  gradedAt: string;
}

export interface ReviewTest {
  id: string;
  assignedAt: string;
  levels: (1 | 2 | 3 | 4)[];
  scores: [ReviewScore?, ReviewScore?, ReviewScore?, ReviewScore?];
}

function nextGradeIndex(scores: ReviewTest['scores']): number | null {
  const idx = scores.findIndex((s) => s === undefined);
  return idx === -1 ? null : idx;
}

function isPending(test: ReviewTest) {
  return test.scores.some((s) => s === undefined);
}

export function ReviewTestTable({
  tests,
  showPendingOnly = false,
}: {
  tests: ReviewTest[];
  showPendingOnly?: boolean;
}) {
  const visibleTests = showPendingOnly ? tests.filter(isPending) : tests;
  return (
    <TableContainer>
      <div className="flex flex-col h-95">
        {/* 헤더 — 고정 */}
        <table className="w-full border-collapse table-fixed shrink-0">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[11%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-left">
                TEST ID
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-left">
                ASSIGNED
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-left">
                LEVEL
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-center">
                SCORE 1
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-center">
                SCORE 2
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-center">
                SCORE 3
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-center">
                SCORE 4
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">
                ACTIONS
              </th>
            </tr>
          </thead>
        </table>
        {/* 바디 — 스크롤 */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-track]:bg-transparent">
          {visibleTests.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-on-surface-variant/50 font-medium">
              배정된 시험이 없습니다.
            </div>
          ) : (
            <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[11%]" />
              </colgroup>
              <tbody>
                {visibleTests.map((test) => {
                  const gradeNext = nextGradeIndex(test.scores);
                  return (
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
                      <td className="px-4 py-5">
                        <AssignedLevelBlocks levels={test.levels} />
                      </td>
                      {([0, 1, 2, 3] as const).map((i) => {
                        const score = test.scores[i];
                        const isNext = gradeNext === i;
                        return (
                          <td key={i} className="px-4 py-3 text-center">
                            {score ? (
                              <div className="inline-flex flex-col items-center">
                                <div className="flex items-center gap-0.5">
                                  <span className="font-headline font-bold text-primary-container ">
                                    {score.value}
                                  </span>
                                  <button className="flex items-center text-on-surface-variant hover:text-primary-container transition-colors">
                                    <span
                                      className="material-symbols-outlined leading-none"
                                      style={{ fontSize: '18px' }}
                                    >
                                      edit
                                    </span>
                                  </button>
                                </div>
                                <span className="flex justify-center text-[12px] text-on-surface-variant/60">
                                  {score.gradedAt}
                                </span>
                              </div>
                            ) : isNext ? (
                              <button className="bg-primary-container text-white w-20 h-8 rounded-md text-[11px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1 mx-auto">
                                <span className="material-symbols-outlined text-sm">
                                  fact_check
                                </span>
                                Grade
                              </button>
                            ) : (
                              <span className="text-on-surface-variant/30 text-sm">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-on-surface-variant hover:text-primary-container transition-colors">
                            <span className="material-symbols-outlined text-xl">print</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </TableContainer>
  );
}
