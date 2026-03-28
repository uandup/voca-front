import { BreadcrumbPageTitle } from "@/shared/ui/BreadcrumbPageTitle";
import { CLASS_DETAIL_MOCK, type StudentRow } from "./mock/classDetailMockData";

function TrendIcon({ trend }: { trend: StudentRow["trend"] }) {
  if (trend === "up")
    return (
      <span className="material-symbols-outlined text-green-600 text-lg">
        trending_up
      </span>
    );
  if (trend === "down")
    return (
      <span className="material-symbols-outlined text-error text-lg">
        trending_down
      </span>
    );
  return (
    <span className="material-symbols-outlined text-outline text-lg">
      trending_flat
    </span>
  );
}

export default function ClassDetailPage() {
  const data = CLASS_DETAIL_MOCK;

  return (
    <main>
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <BreadcrumbPageTitle parents={["Classes"]} title={data.className} />
        </div>
        <div className="">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-on-primary-fixed-variant bg-surface-container-lowest border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-colors font-medium">
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            Edit Members
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,21,80,0.04)] border border-outline-variant/10">
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 text-primary">
              <span className="material-symbols-outlined text-2xl">
                analytics
              </span>
            </span>
            <span className="text-xs font-bold text-primary px-2 py-1 bg-primary-fixed rounded-full">
              {data.averageDelta}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            Class Average
          </p>
          <h3 className="text-3xl font-headline font-bold text-primary mt-1">
            {data.classAverage}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,21,80,0.04)] border border-outline-variant/10">
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary-container/20 text-secondary">
              <span className="material-symbols-outlined text-2xl">group</span>
            </span>
            <span className="text-xs font-bold text-on-surface-variant">
              Capacity: {data.capacity}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            Student Count
          </p>
          <h3 className="text-3xl font-headline font-bold text-primary mt-1">
            {data.studentCount}
          </h3>
        </div>
      </section>

      {/* Student Roster */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/30">
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Student Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">
                  Grade
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Last Test Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Assigned Level
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">
                  Recent Score
                </th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">
                  Overall Accuracy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {data.students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-surface-bright transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold text-sm ${student.avatarColor}`}
                      >
                        {student.initials}
                      </div>
                      <div>
                        <p className="font-headline font-bold text-primary group-hover:text-primary-container transition-colors">
                          {student.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-surface-container-highest text-primary font-bold text-sm rounded-full">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {student.lastTestDate}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full">
                      {student.assignedLevel}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="font-headline font-semibold text-primary">
                      {student.recentScore}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-headline font-bold text-primary">
                        {student.accuracy}
                      </span>
                      <TrendIcon trend={student.trend} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-5 bg-surface-container-low flex justify-between items-center text-sm text-on-surface-variant">
          <p>
            Showing {data.studentCount} students in Class {data.className}
          </p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-lg">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-white transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-60">
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          add
        </span>
      </button>
    </main>
  );
}
