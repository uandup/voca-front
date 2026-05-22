import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudents, toStudentPickerRow, studentKeys } from '@/entities/student';
import type { StudentPickerRow } from '@/entities/student';
import type { PendingParent } from '../../model/types';

interface Props {
  parent: PendingParent;
  // 이미 이 학부모에 매칭된 학생 id 집합 — 목록에서 '추가됨'으로 표시한다.
  selectedIds: Set<number>;
  // 학생을 선택하면 호출 — 다자녀 연속 선택을 위해 패널은 닫지 않는다(닫기 책임은 onClose).
  onSelect: (student: StudentPickerRow) => void;
  onClose: () => void;
}

export function StudentMatchPanel({ parent, selectedIds, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('');

  // 학생 관리 페이지와 동일한 쿼리 키를 사용하여 react-query 캐시를 공유한다.
  // select에서 picker용 최소 매퍼를 적용하므로 다른 구독자의 매핑에는 영향을 주지 않는다.
  const { data: students } = useQuery({
    queryKey: studentKeys.lists(),
    queryFn: getStudents,
    select: (res) => res.data?.map(toStudentPickerRow) ?? [],
  });

  const keyword = search.trim().toLowerCase();
  const filtered = (students ?? []).filter((s) => {
    if (!keyword) return true;
    const englishName = `${s.nameFirstEn} ${s.nameLastEn}`.trim().toLowerCase();
    return s.nameKo.toLowerCase().includes(keyword) || englishName.includes(keyword);
  });

  return (
    <div className="absolute left-full top-0 ml-3 w-72 bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-outline-variant/30 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-extrabold font-headline text-primary">Match Student</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <p className="text-xs text-on-surface-variant">
          Parent: <span className="font-bold text-on-surface">{parent.name}</span> → Child:{' '}
          <span className="font-bold text-on-surface">{parent.requestedChildName}</span>
        </p>
      </div>

      <div className="px-4 py-3 border-b border-outline-variant/20 shrink-0">
        <input
          autoFocus
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-1.5 pl-2 pr-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Search student name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant/20">
        {filtered.length === 0 ? (
          <li className="px-5 py-6 text-xs text-on-surface-variant text-center">
            No students found
          </li>
        ) : (
          filtered.map((student) => {
            const added = selectedIds.has(student.id);
            return (
              <li key={student.id}>
                <button
                  type="button"
                  onClick={() => onSelect(student)}
                  className="w-full flex items-center justify-between gap-2 text-left px-5 py-3 hover:bg-surface-container-low transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface">
                      {student.nameKo}
                      <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                        G{student.grade}
                      </span>
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {`${student.nameFirstEn} ${student.nameLastEn}`.trim()}
                    </p>
                  </div>
                  {/* 이미 매칭된 학생 — 다시 눌러도 중복은 무시되므로 표시만 한다. */}
                  {added && (
                    <span
                      className="material-symbols-outlined text-primary shrink-0"
                      style={{ fontSize: '18px' }}
                    >
                      check_circle
                    </span>
                  )}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
