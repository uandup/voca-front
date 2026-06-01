import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { ColumnToggleDropdown } from '@/shared/ui/ColumnToggleDropdown';
import { usePersistentState } from '@/shared/lib/usePersistentState';
import type { StudentManageTableRow } from '@/entities/student';
import { GRADES } from '@/entities/member';
import { DIFFICULTY_LEVELS } from '@/entities/word';
import { useQuery } from '@tanstack/react-query';
import { getClassrooms, toClassListItem, classKeys } from '@/entities/class';
import { useStudentManage } from './model/useStudentManage';
import { STUDENT_COLUMN_STORAGE_KEY, STUDENT_COLUMN_OPTIONS } from './model/studentColumns';
import { EditStudentModal } from './ui/modals/EditStudentModal';
import { DeleteConfirmModal } from './ui/modals/DeleteConfirmModal';
import { MemoPopup } from '@/features/memo';
import { StudentManageTable } from './ui/table/StudentManageTable';

export default function StudentManagePage() {
  const { students, remove } = useStudentManage();
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | ''>('');
  const [classFilter, setClassFilter] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentManageTableRow | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentManageTableRow | null>(null);
  const [memoStudent, setMemoStudent] = useState<StudentManageTableRow | null>(null);

  // 테이블 컬럼 가시성은 페이지가 소유한다 — 토글 UI(Columns 버튼)를 검색바 위 제목 줄에 두고,
  // 숨김 목록은 StudentTable에 prop으로 내린다. localStorage에 영속화되어 재방문 후에도 유지된다.
  const [hiddenColumns, setHiddenColumns] = usePersistentState<string[]>(
    STUDENT_COLUMN_STORAGE_KEY,
    [],
  );
  function toggleColumn(key: string) {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }
  const visibleColumnKeys = new Set(
    STUDENT_COLUMN_OPTIONS.filter((c) => !hiddenColumns.includes(c.key)).map((c) => c.key),
  );

  const { data: allClasses = [] } = useQuery({
    queryKey: classKeys.list(),
    queryFn: getClassrooms,
    select: (res) => res.data?.map(toClassListItem) ?? [],
  });

  const filtered = students.filter((s) => {
    const matchesSearch =
      `${s.nameFirstEn} ${s.nameLastEn}`.toLowerCase().includes(search.toLowerCase()) ||
      s.nameKo.includes(search);
    const matchesGrade = gradeFilter ? s.grade === Number(gradeFilter) : true;
    const matchesLevel = levelFilter !== '' ? s.assignedLevel === levelFilter : true;
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
      {/* 제목 줄 우측에 컬럼 토글 버튼 — 검색 필터 바보다 위에 위치한다. */}
      <div className="flex items-center justify-between">
        <PageTitle title="Student Management" />
        <ColumnToggleDropdown
          options={STUDENT_COLUMN_OPTIONS}
          visible={visibleColumnKeys}
          onToggle={toggleColumn}
        />
      </div>

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
          {GRADES.map((g) => (
            <option key={g} value={g}>
              G{g}
            </option>
          ))}
        </select>

        {/* Level filter */}
        <select
          className="bg-background border border-outline-variant/30 rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <option value="">Level: All</option>
          {DIFFICULTY_LEVELS.map((l) => (
            <option key={l} value={l}>
              Level {l}
            </option>
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
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          className="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant text-sm font-bold hover:bg-surface-container-low transition-colors"
          onClick={() => {
            setSearch('');
            setGradeFilter('');
            setLevelFilter('');
            setClassFilter('');
          }}
        >
          Reset
        </button>
      </div>

      <StudentManageTable students={filtered} actions={rowActions} hiddenColumns={hiddenColumns} />

      {editingStudent && (
        <EditStudentModal studentId={editingStudent.id} onClose={() => setEditingStudent(null)} />
      )}

      {deletingStudent && (
        <DeleteConfirmModal
          student={deletingStudent}
          onClose={() => setDeletingStudent(null)}
          onConfirm={(id) => remove(id)}
        />
      )}

      {memoStudent && (
        <MemoPopup
          studentId={memoStudent.id}
          studentName={memoStudent.nameKo}
          onClose={() => setMemoStudent(null)}
        />
      )}
    </main>
  );
}
