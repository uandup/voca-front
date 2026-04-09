import { useRef, useState } from "react";
import { PageTitle } from "@/shared/ui/PageTitle";
import {
  STUDENT_MANAGE_MOCK,
  type ManagedStudent,
} from "./mock/studentManageMockData";
import { EditStudentModal } from "./ui/modals/EditStudentModal";
import { DeleteConfirmModal } from "./ui/modals/DeleteConfirmModal";
import { MemoPopup } from "./ui/modals/MemoPopup";
import { StudentTable } from "./ui/table/StudentTable";

export default function StudentManagePage() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | "">("");
  const [classFilter, setClassFilter] = useState("");
  const [students, setStudents] = useState<ManagedStudent[]>(STUDENT_MANAGE_MOCK);
  const [editingStudent, setEditingStudent] = useState<ManagedStudent | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<ManagedStudent | null>(null);
  const [memoStudent, setMemoStudent] = useState<ManagedStudent | null>(null);

  // Set Grade
  const [showSetGrade, setShowSetGrade] = useState(false);
  const [pendingGrade, setPendingGrade] = useState<number | "">("");
  const setGradeRef = useRef<HTMLDivElement>(null);

  const grades = [...new Set(students.map((s) => s.grade))].sort((a, b) => a - b);
  const allClasses = [...new Set(students.flatMap((s) => s.classes))].sort();

  function handleSave(updated: ManagedStudent) {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  function handleDelete(id: number) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function handleSetGradeConfirm() {
    if (pendingGrade === "") return;
    setStudents((prev) => prev.map((s) => ({ ...s, grade: pendingGrade as number })));
    setShowSetGrade(false);
    setPendingGrade("");
  }

  const filtered = students.filter((s) => {
    const matchesSearch =
      `${s.nameFirstEn} ${s.nameLastEn}`.toLowerCase().includes(search.toLowerCase()) ||
      `${s.nameLastKo}${s.nameFirstKo}`.includes(search);
    const matchesGrade = gradeFilter ? s.grade === Number(gradeFilter) : true;
    const matchesLevel = levelFilter !== "" ? s.assignedLevel === levelFilter : true;
    const matchesClass = classFilter ? s.classes.includes(classFilter) : true;
    return matchesSearch && matchesGrade && matchesLevel && matchesClass;
  });

  const rowActions = {
    onEdit: setEditingStudent,
    onDelete: setDeletingStudent,
    onMemo: setMemoStudent,
  };

  return (
    <main>
      <PageTitle title="Student Management" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
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

        {/* Grade filter */}
        <select
          className="bg-background border border-outline-variant/30 rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="">Grade: All</option>
          {grades.map((g) => (
            <option key={g} value={g}>G{g}</option>
          ))}
        </select>

        {/* Level filter */}
        <select
          className="bg-background border border-outline-variant/30 rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
          value={levelFilter}
          onChange={(e) =>
            setLevelFilter(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">Level: All</option>
          {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map((l) => (
            <option key={l} value={l}>Level {l}</option>
          ))}
        </select>

        {/* Class filter */}
        <select
          className="bg-background border border-outline-variant/30 rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="">Class: All</option>
          {allClasses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Reset */}
        <button
          className="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant text-sm font-bold hover:bg-surface-container-low transition-colors"
          onClick={() => {
            setSearch("");
            setGradeFilter("");
            setLevelFilter("");
            setClassFilter("");
          }}
        >
          Reset
        </button>

        {/* Set Grade */}
        <div className="relative ml-auto" ref={setGradeRef}>
          <button
            className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
            onClick={() => {
              setShowSetGrade((v) => !v);
              setPendingGrade("");
            }}
          >
            <span className="material-symbols-outlined text-base">swap_vert</span>
            Set Grade
          </button>
          {showSetGrade && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-outline-variant/20 rounded-xl shadow-lg p-4 flex flex-col gap-3 z-10 min-w-48">
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                전체 학생 학년 변경
              </p>
              <div className="relative">
                <select
                  className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={pendingGrade}
                  onChange={(e) =>
                    setPendingGrade(e.target.value === "" ? "" : Number(e.target.value))
                  }
                >
                  <option value="">학년 선택</option>
                  {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                    <option key={g} value={g}>G{g}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">
                  expand_more
                </span>
              </div>
              <button
                disabled={pendingGrade === ""}
                onClick={handleSetGradeConfirm}
                className="w-full py-2 rounded-lg bg-primary text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                적용
              </button>
            </div>
          )}
        </div>
      </div>

      <StudentTable students={filtered} actions={rowActions} />

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

      {memoStudent && (
        <MemoPopup
          studentName={`${memoStudent.nameLastKo}${memoStudent.nameFirstKo}`}
          memos={memoStudent.memos}
          onClose={() => setMemoStudent(null)}
          onChange={(newMemos) => {
            setStudents((prev) =>
              prev.map((s) =>
                s.id === memoStudent.id ? { ...s, memos: newMemos } : s,
              ),
            );
            setMemoStudent((prev) =>
              prev ? { ...prev, memos: newMemos } : null,
            );
          }}
        />
      )}
    </main>
  );
}
