import { useNavigate } from "@tanstack/react-router";

type AssignmentStatus = "Active" | "Pending" | "Unassigned";

interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  level: number;
  levelColor: "secondary" | "neutral";
  wordCount: number;
  status: AssignmentStatus;
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Elena Vance",
    email: "elena.v@lexicon.edu",
    grade: "Grade 11",
    level: 4,
    levelColor: "secondary",
    wordCount: 40,
    status: "Active",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    email: "m.thorne@lexicon.edu",
    grade: "Grade 10",
    level: 2,
    levelColor: "neutral",
    wordCount: 25,
    status: "Pending",
  },
  {
    id: 3,
    name: "Sasha Grey",
    email: "s.grey@lexicon.edu",
    grade: "Grade 12",
    level: 3,
    levelColor: "secondary",
    wordCount: 35,
    status: "Active",
  },
  {
    id: 4,
    name: "Julian Banks",
    email: "j.banks@lexicon.edu",
    grade: "Grade 11",
    level: 4,
    levelColor: "secondary",
    wordCount: 50,
    status: "Active",
  },
];

const statusDot: Record<AssignmentStatus, string> = {
  Active: "bg-green-500",
  Pending: "bg-tertiary-container",
  Unassigned: "bg-error",
};

export function TestAssignmentPage() {
  const navigate = useNavigate();

  return (
    <main>
      {/* Page Title */}
      <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-8">
        Test Assignment
      </h1>
      {/* Table Header Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full">
            Total Students: <span className="text-primary font-bold">124</span>{" "}
            | Unassigned Students:{" "}
            <span className="text-error font-bold">12</span>
          </p>
          <button className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-sm">
              auto_awesome
            </span>
            Batch Assign
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="relative flex-1 min-w-[300px]">
            <input
              className="w-full bg-background border border-outline-variant/30 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Search student name..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
          </div>
          <select className="bg-background border border-outline-variant/30 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer">
            <option value="">Grade Filter</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <select className="bg-background border border-outline-variant/30 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer">
            <option value="">Level Filter</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
          <button className="p-2 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-xl">
              filter_list
            </span>
          </button>
        </div>
      </div>
      {/* Student Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_8px_24px_rgba(0,21,80,0.08)] overflow-hidden">
        {/* Table Header */}
        <div className="px-8 py-5 flex items-center justify-between bg-surface-container-low/50 border-b border-outline-variant/10">
          <h3 className="font-bold text-primary font-headline">
            Student Roster
          </h3>
          <label className="flex items-center gap-2 cursor-pointer ml-6">
            <input
              className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20"
              type="checkbox"
            />
            <span className="text-xs font-semibold text-on-surface-variant">
              Unassigned Students Only
            </span>
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-on-surface-variant font-medium">
              Showing 1-10 of 124 students
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant/10">
              <th className="py-5 px-8 w-12">
                <input
                  className="w-5 h-5 rounded border-outline text-primary focus:ring-primary/20"
                  type="checkbox"
                />
              </th>
              <th className="py-5 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-widest font-label">
                Student Name
              </th>
              <th className="py-5 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-widest font-label">
                Grade
              </th>
              <th className="py-5 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-widest font-label">
                Difficulty Level
              </th>
              <th className="py-5 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-widest font-label">
                Assigned Word Count
              </th>
              <th className="py-5 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-widest font-label">
                Assignment Status
              </th>
              <th className="py-5 px-8 text-right font-bold text-on-surface-variant text-xs uppercase tracking-widest font-label">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {mockStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                onClick={() =>
                  navigate({
                    to: "/teacher/test-assignment/$studentId",
                    params: { studentId: String(student.id) },
                  })
                }
              >
                <td className="py-6 px-8">
                  <input
                    className="w-5 h-5 rounded border-outline text-primary focus:ring-primary/20"
                    type="checkbox"
                  />
                </td>
                <td className="py-6 px-4">
                  <p className="font-bold text-on-surface group-hover:text-primary transition-colors">
                    {student.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {student.email}
                  </p>
                </td>
                <td className="py-6 px-4 text-sm font-medium text-on-surface">
                  {student.grade}
                </td>
                <td className="py-6 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      student.levelColor === "secondary"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    Level {student.level}
                  </span>
                </td>
                <td className="py-6 px-4 text-sm font-medium text-on-surface">
                  {student.wordCount} words
                </td>
                <td className="py-6 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${statusDot[student.status]}`}
                    />
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {student.status}
                    </span>
                  </div>
                </td>
                <td className="py-6 px-8 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-primary font-bold text-sm hover:underline">
                      Edit
                    </button>
                    <button
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[1.2rem]">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-8 bg-surface-container-low/20 text-center">
          <button className="text-sm font-bold text-primary hover:text-primary-container flex items-center gap-1 mx-auto">
            View all 124 students
            <span className="material-symbols-outlined">
              keyboard_arrow_down
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
