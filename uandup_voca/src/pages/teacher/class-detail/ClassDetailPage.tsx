import { useState } from "react";
import { BreadcrumbPageTitle } from "@/shared/ui/BreadcrumbPageTitle";
import { TableContainer } from "@/shared/ui/TableContainer";
import { CLASS_DETAIL_MOCK } from "./mock/classDetailMockData";
import { EditMembersModal } from "./ui/modals/EditMembersModal";
import { AssignedLevelBlocks } from "./ui/AssignedLevelBlocks";

export default function ClassDetailPage() {
  const data = CLASS_DETAIL_MOCK;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <main>
      {/* Header */}
      <BreadcrumbPageTitle parents={["Classes"]} title={data.className} />

      {/* Overview Cards */}
      <section className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,21,80,0.04)] border/10 flex items-center justify-between">
          <p className="text-on-surface-variant text-lg font-bold">
            Class Average
          </p>
          <h3 className="text-3xl font-headline font-bold text-primary">
            {data.classAverage}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,21,80,0.04)] border/10 flex items-center justify-between">
          <p className="text-on-surface-variant text-lg font-bold">
            Student Count
          </p>
          <h3 className="text-3xl font-headline font-bold text-primary">
            {data.studentCount}
          </h3>
        </div>

        <div className="flex items-end justify-end">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-on-primary-fixed-variant bg-surface-container-lowest border/20 shadow-sm hover:bg-surface-container-low transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            Edit Members
          </button>
        </div>
      </section>

      {/* Student Roster */}
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[10%]" />
              <col className="w-[8%]" />
              <col className="w-[15%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
              <col className="w-[35%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-container-highest/30">
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Grade
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Assigned Level
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Prev 2
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Prev
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Latest
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  ACR
                </th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Memo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {data.students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-surface-bright transition-colors group"
                >
                  <td className="px-8 py-5 text-center border-r border-outline-variant/20">
                    <p className="font-headline font-bold text-primary group-hover:text-primary-container transition-colors">
                      {student.name}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center border-r border-outline-variant/20">
                    <span className="px-3 py-1 bg-surface-container-highest text-primary font-bold text-sm rounded-full">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center border-r border-outline-variant/20">
                    <AssignedLevelBlocks levels={student.assignedLevels} />
                  </td>
                  {[
                    student.scores[student.scores.length - 3],
                    student.scores[student.scores.length - 2],
                    student.scores[student.scores.length - 1],
                  ].map((score, i) => (
                    <td
                      key={i}
                      className="px-6 py-5 text-center border-r border-outline-variant/20"
                    >
                      {score ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-headline font-semibold text-sm text-on-surface-variant">
                            {score.correct}/{score.total}
                          </span>
                          <span className="text-[12px] text-on-surface-variant/80">
                            {Math.round((score.correct / score.total) * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/30 text-sm">
                          -
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-5 text-center border-r border-outline-variant/20">
                    <span className="font-headline font-bold text-primary">
                      {student.accuracy}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant">
                    {student.memo ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>

      {isEditModalOpen && (
        <EditMembersModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </main>
  );
}
