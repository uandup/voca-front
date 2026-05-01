import { useState } from 'react';
import { TableContainer } from '@/shared/ui/TableContainer';
import type { Student } from '@/entities/member';
import { StudentTableRow, type RowActions } from './StudentTableRow';

type SortKey = keyof Pick<
  Student,
  'nameLastKo' | 'grade' | 'assignedLevel' | 'assignedWordCount' | 'testQuestionCount' | 'accuracy'
>;
type SortDir = 'asc' | 'desc';

const COLUMNS: { label: string; key?: SortKey; className?: string }[] = [
  { label: 'Name', key: 'nameLastKo' },
  { label: 'Grade', key: 'grade', className: 'text-center' },
  { label: 'Level', key: 'assignedLevel', className: 'text-center' },
  { label: 'QTY', key: 'assignedWordCount', className: 'text-center' },
  { label: 'TEST', key: 'testQuestionCount', className: 'text-center' },
  { label: 'Config', className: 'text-center' },
  { label: 'Recent', className: 'text-center' },
  { label: 'ACR', key: 'accuracy', className: 'text-center' },
  { label: 'Memo' },
  { label: 'Actions', className: 'text-right' },
];

function sortStudents(data: Student[], key: SortKey, dir: SortDir): Student[] {
  return [...data].sort((a, b) => {
    const av = key === 'accuracy' ? parseFloat(a[key] ?? '0') : (a[key] as number | string);
    const bv = key === 'accuracy' ? parseFloat(b[key] ?? '0') : (b[key] as number | string);
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

interface StudentTableProps {
  students: Student[];
  actions: RowActions;
}

export function StudentTable({ students, actions }: StudentTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortKey(null);
        setSortDir('asc');
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = sortKey ? sortStudents(students, sortKey, sortDir) : students;

  return (
    <TableContainer>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[7%]" />
            <col className="w-[7%]" />
            <col className="w-[6%]" />
            <col className="w-[6%]" />
            <col className="w-[9%]" />
            <col className="w-[8%]" />
            <col className="w-[6%]" />
            <col className="w-[26%]" />
            <col className="w-[13%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface-container-highest/30">
              {COLUMNS.map((col, i) => (
                <th
                  key={col.label}
                  onClick={col.key ? () => handleSort(col.key!) : undefined}
                  className={`px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest ${i < COLUMNS.length - 1 ? 'border-r border-outline-variant/20' : ''} ${col.key ? 'cursor-pointer select-none hover:text-primary transition-colors' : ''} ${col.className ?? ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.key && (
                      <span
                        className="material-symbols-outlined leading-none"
                        style={{ fontSize: '14px' }}
                      >
                        {sortKey === col.key
                          ? sortDir === 'asc'
                            ? 'arrow_upward'
                            : 'arrow_downward'
                          : 'unfold_more'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {sorted.map((student) => (
              <StudentTableRow key={student.id} student={student} actions={actions} />
            ))}
          </tbody>
        </table>
      </div>
    </TableContainer>
  );
}
