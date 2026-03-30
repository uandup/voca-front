import { useState } from "react";
import { PageTitle } from "@/shared/ui/PageTitle";
import { TableContainer } from "@/shared/ui/TableContainer";
import { AssignedLevelBlocks } from "@/entities/vocab";
import {
  STUDENT_MANAGE_MOCK,
  type ManagedStudent,
} from "./mock/studentManageMockData";
import { EditStudentModal } from "./ui/modals/EditStudentModal";
import { DeleteConfirmModal } from "./ui/modals/DeleteConfirmModal";

type SortKey = keyof Pick<
  ManagedStudent,
  "name" | "grade" | "joinedAt" | "testCount" | "accuracy" | "assignedWordCount"
>;
type SortDir = "asc" | "desc";

const COLUMNS: { label: string; key?: SortKey; className?: string }[] = [
  { label: "Name", key: "name" },
  { label: "Joined", key: "joinedAt", className: "text-center" },
  { label: "Grade", key: "grade", className: "text-center" },
  { label: "Tests", key: "testCount", className: "text-center" },
  { label: "ACR", key: "accuracy", className: "text-center" },
  { label: "Level", className: "text-center" },
  { label: "QTY", key: "assignedWordCount", className: "text-center" },
  { label: "Memo" },
  { label: "Actions", className: "text-right" },
];

function sortStudents(
  data: ManagedStudent[],
  key: SortKey,
  dir: SortDir,
): ManagedStudent[] {
  return [...data].sort((a, b) => {
    const av =
      key === "accuracy" ? parseFloat(a[key]) : (a[key] as number | string);
    const bv =
      key === "accuracy" ? parseFloat(b[key]) : (b[key] as number | string);
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

export default function StudentManagePage() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | "">("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [students, setStudents] =
    useState<ManagedStudent[]>(STUDENT_MANAGE_MOCK);
  const [editingStudent, setEditingStudent] = useState<ManagedStudent | null>(
    null,
  );
  const [deletingStudent, setDeletingStudent] = useState<ManagedStudent | null>(
    null,
  );

  const grades = [...new Set(students.map((s) => s.grade))].sort();

  function handleSave(updated: ManagedStudent) {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  function handleDelete(id: number) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nameKo.includes(search);
    const matchesGrade = gradeFilter ? s.grade === Number(gradeFilter) : true;
    const matchesLevel = levelFilter !== "" ? s.assignedLevels.includes(levelFilter as 1 | 2 | 3 | 4) : true;
    return matchesSearch && matchesGrade && matchesLevel;
  });

  const sorted = sortKey ? sortStudents(filtered, sortKey, sortDir) : filtered;

  return (
    <main>
      <PageTitle title="Student Management" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 mb-6">
        <div className="relative flex-1 min-w-70">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            className="w-full bg-background border border-outline-variant/30 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search student name..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-background border border-outline-variant/30 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="">Grade: All</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              G{g}
            </option>
          ))}
        </select>
        <select
          className="bg-background border border-outline-variant/30 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="">Level: All</option>
          {([1, 2, 3, 4] as const).map((l) => (
            <option key={l} value={l}>
              Level {l}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant text-sm font-bold hover:bg-surface-container-low transition-colors"
          onClick={() => {
            setSearch("");
            setGradeFilter("");
            setLevelFilter("");
          }}
        >
          Reset
        </button>
      </div>

      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[9%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
              <col className="w-[7%]" />
              <col className="w-[12%]" />
              <col className="w-[7%]" />
              <col className="w-[25%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-container-highest/30">
                {COLUMNS.map((col, i) => (
                  <th
                    key={col.label}
                    onClick={col.key ? () => handleSort(col.key!) : undefined}
                    className={`px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest ${i < 8 ? "border-r border-outline-variant/20" : ""} ${col.key ? "cursor-pointer select-none hover:text-primary transition-colors" : ""} ${col.className ?? ""}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.key && (
                        <span
                          className="material-symbols-outlined leading-none"
                          style={{ fontSize: "14px" }}
                        >
                          {sortKey === col.key
                            ? sortDir === "asc"
                              ? "arrow_upward"
                              : "arrow_downward"
                            : "unfold_more"}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {sorted.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-surface-container-low/30 transition-colors group"
                >
                  {/* Name */}
                  <td className="px-4 py-4 border-r border-outline-variant/20">
                    <p className="font-headline font-bold text-sm text-primary group-hover:text-primary-container transition-colors">
                      {student.nameKo}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {student.name}
                    </p>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <p className="text-xs text-on-surface-variant font-medium">
                      {student.joinedAt}
                    </p>
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <span className="px-2 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-full">
                      G{student.grade}
                    </span>
                  </td>

                  {/* Test count */}
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <span className="font-headline font-bold text-sm text-on-surface">
                      {student.testCount}
                    </span>
                  </td>

                  {/* Accuracy */}
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <span className="font-headline font-bold text-sm text-primary">
                      {student.accuracy}
                    </span>
                  </td>

                  {/* Assigned levels */}
                  <td className="px-6 py-4 text-center border-r border-outline-variant/20">
                    <AssignedLevelBlocks levels={student.assignedLevels} />
                  </td>

                  {/* Word count */}
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <span className="font-headline font-bold text-sm text-on-surface">
                      {student.assignedWordCount}
                    </span>
                  </td>

                  {/* Memo */}
                  <td className="px-4 py-4 text-sm text-on-surface-variant border-r border-outline-variant/20">
                    {student.memo ?? "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">
                          edit
                        </span>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingStudent(student)}
                        className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleSave}
        />
      )}

      {deletingStudent && (
        <DeleteConfirmModal
          student={deletingStudent}
          onClose={() => setDeletingStudent(null)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}
