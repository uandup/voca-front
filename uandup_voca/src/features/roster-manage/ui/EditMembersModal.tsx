import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import {
  AVAILABLE_STUDENTS_MOCK,
  CURRENT_ROSTER_MOCK,
  GRADE_OPTIONS,
  type MemberStudent,
} from '../mock/editMembersMockData';

interface EditMembersModalProps {
  onClose: () => void;
}

export function EditMembersModal({ onClose }: EditMembersModalProps) {
  const [roster, setRoster] = useState<MemberStudent[]>(CURRENT_ROSTER_MOCK);
  const [available, setAvailable] = useState<MemberStudent[]>(AVAILABLE_STUDENTS_MOCK);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  function removeFromRoster(student: MemberStudent) {
    setRoster((prev) => prev.filter((s) => s.id !== student.id));
    setAvailable((prev) => [...prev, student]);
  }

  function addToRoster(student: MemberStudent) {
    setAvailable((prev) => prev.filter((s) => s.id !== student.id));
    setRoster((prev) => [...prev, student]);
  }

  function handleResetFilters() {
    setSearch('');
    setGradeFilter('');
  }

  const filteredAvailable = available.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter ? s.grade === gradeFilter : true;
    return matchesSearch && matchesGrade;
  });

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white sticky top-0">
          <div>
            <h2 className="text-2xl font-extrabold font-headline tracking-tight text-primary">
              Member Management
            </h2>
            <p className="text-on-surface-variant text-sm mt-1">
              {roster.length} Students in roster
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md active:scale-95 transition-all"
            >
              Save Roster
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
            {/* Left: Current Roster */}
            <div className="flex flex-col gap-4">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  group
                </span>
                Current Roster
                <span className="bg-primary-fixed text-on-primary-fixed-variant text-xs px-2 py-0.5 rounded-full">
                  {roster.length} Students
                </span>
              </h3>
              {/* 카드 5개 높이 고정 + 내부 스크롤 */}
              <div className="bg-surface-container-low rounded-xs overflow-hidden flex flex-col h-105">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-track]:bg-transparent">
                  {roster.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white p-4 rounded-xs shadow-sm border border-outline-variant/10 flex items-center justify-between hover:border-primary/20 transition-all"
                    >
                      <div>
                        <p className="font-bold text-on-surface text-sm font-headline">
                          {student.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">Grade: {student.grade}</p>
                      </div>
                      <button
                        onClick={() => removeFromRoster(student)}
                        className="w-8 h-8 flex items-center border border-gray-200 justify-center rounded-lg bg-error-container/20 text-error hover:bg-error hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center: swap icon */}
            <div className="flex items-center justify-center h-105 ">
              <span className="material-symbols-outlined text-3xl text-primary/70">sync_alt</span>
            </div>

            {/* Right: Available Students */}
            <div className="flex flex-col gap-4">
              <h3 className="font-headline font-bold text-lg">Available Students</h3>
              {/* 카드 5개 높이 고정 + 검색 sticky + 내부 스크롤 */}
              <div className="bg-surface-container-low rounded-xs overflow-hidden flex flex-col h-105">
                {/* 검색/필터 — 고정 */}
                <div className="p-4 pb-2 bg-surface-container-low flex flex-col gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                      search
                    </span>
                    <input
                      className="w-full pl-9 pr-4 py-2 bg-white border border-outline-variant/30 rounded-xs text-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="Student Name"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        className="w-full pl-4 pr-10 py-2 bg-white border border-outline-variant/30 rounded-xs text-sm focus:ring-2 focus:ring-primary/20 appearance-none"
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                      >
                        <option value="">Filter by Grade</option>
                        {GRADE_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                        expand_more
                      </span>
                    </div>
                    <button
                      className="bg-surface-container-highest px-4 py-2 rounded-xs text-on-surface-variant text-sm font-bold hover:bg-primary/10 hover:text-primary active:scale-95 transition-all"
                      onClick={handleResetFilters}
                    >
                      Init
                    </button>
                  </div>
                </div>
                {/* 학생 목록 스크롤 */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-track]:bg-transparent">
                  {filteredAvailable.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white p-4 rounded-xs shadow-sm border border-outline-variant/10 flex items-center justify-between hover:border-primary/20 transition-all"
                    >
                      <div>
                        <p className="font-bold text-on-surface text-sm font-headline">
                          {student.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">Grade: {student.grade}</p>
                      </div>
                      <button
                        onClick={() => addToRoster(student)}
                        className="w-8 h-8 flex items-center border border-gray-200 justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
