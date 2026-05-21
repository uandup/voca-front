import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TableContainer } from '@/shared/ui/TableContainer';
import type { StudentManageTableRow } from '@/entities/student';
import { LevelBlock } from '@/entities/word';
import { isAdmin } from '@/entities/teacher';
import { TestConfigBadges } from '@/entities/test';

// 행의 메모·수정·삭제 액션 핸들러. StudentManagePage가 모달 상태를 열도록 주입한다.
export interface RowActions {
  onEdit: (student: StudentManageTableRow) => void;
  onDelete: (student: StudentManageTableRow) => void;
  onMemo: (student: StudentManageTableRow) => void;
}

type SortKey = keyof Pick<
  StudentManageTableRow,
  'nameKo' | 'grade' | 'assignedLevel' | 'assignedWordCount' | 'testQuestionCount' | 'accuracy'
>;
type SortDir = 'asc' | 'desc';

// 한 컬럼의 단일 정의 — colgroup / thead / tbody가 모두 이 배열에서 파생되어
// 컬럼 추가·삭제·숨김 시 한 곳만 고치면 세 위치가 자동으로 동기화된다.
interface ColumnDef {
  key: string;
  label: string;
  // table-fixed에서 <col>의 선호 너비. 숨겨진 컬럼을 빼면 남은 합이 100% 미만이 되고,
  // 브라우저가 남은 공간을 각 <col> 너비 비율대로 재분배한다(별도 정규화 불필요).
  width: string;
  align: 'left' | 'center' | 'right';
  // 정렬 가능한 컬럼이면 정렬 기준 키. 없으면 헤더 클릭 정렬이 비활성.
  sortKey?: SortKey;
  // Name·Actions처럼 행 식별·핵심 조작에 필수라 숨길 수 없는 컬럼.
  locked?: boolean;
  // 행 셀 렌더러. Memo·Actions 컬럼이 actions 콜백을 쓰므로 함께 받는다.
  render: (student: StudentManageTableRow, actions: RowActions) => ReactNode;
}

const ALIGN_CLASS: Record<ColumnDef['align'], string | undefined> = {
  left: undefined,
  center: 'text-center',
  right: 'text-right',
};

const COLUMNS: ColumnDef[] = [
  {
    key: 'name',
    label: 'Name',
    width: '11%',
    align: 'left',
    sortKey: 'nameKo',
    locked: true,
    render: (s) => (
      <>
        <p className="font-headline font-bold text-sm text-primary group-hover:text-primary/80 transition-colors">
          {s.nameKo}
        </p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {s.nameFirstEn} {s.nameLastEn}
        </p>
      </>
    ),
  },
  {
    key: 'grade',
    label: 'Grade',
    width: '7%',
    align: 'center',
    sortKey: 'grade',
    render: (s) => (
      <span className="px-2 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-full">
        G{s.grade}
      </span>
    ),
  },
  {
    key: 'level',
    label: 'Level',
    width: '7%',
    align: 'center',
    sortKey: 'assignedLevel',
    render: (s) => (
      <div className="flex justify-center">
        <LevelBlock level={s.assignedLevel} />
      </div>
    ),
  },
  {
    key: 'qty',
    label: 'QTY',
    width: '6%',
    align: 'center',
    sortKey: 'assignedWordCount',
    render: (s) => (
      <span className="font-headline font-bold text-sm text-on-surface">{s.assignedWordCount}</span>
    ),
  },
  {
    key: 'test',
    label: 'TEST',
    width: '6%',
    align: 'center',
    sortKey: 'testQuestionCount',
    render: (s) => (
      <span className="font-headline font-bold text-sm text-on-surface">{s.testQuestionCount}</span>
    ),
  },
  {
    key: 'config',
    label: 'Config',
    width: '11%',
    align: 'center',
    render: (s) => (
      <div className="flex justify-center">
        <TestConfigBadges config={s.testConfig} />
      </div>
    ),
  },
  {
    key: 'recent',
    label: 'Recent',
    width: '8%',
    align: 'center',
    render: (s) =>
      s.recentScore ? (
        <span className="font-headline font-bold text-primary text-sm">
          {s.recentScore.score}
          <span>/{s.recentScore.total}</span>
        </span>
      ) : (
        <span className="text-on-surface-variant text-sm">—</span>
      ),
  },
  {
    key: 'acr',
    label: 'ACR',
    width: '6%',
    align: 'center',
    sortKey: 'accuracy',
    render: (s) => (
      <span className="font-headline font-bold text-sm text-primary">{s.accuracy ?? '—'}</span>
    ),
  },
  {
    key: 'memo',
    label: 'Memo',
    width: '26%',
    align: 'left',
    render: (s, actions) => (
      <div className="flex items-center gap-1.5">
        <p className="text-xs text-on-surface-variant truncate flex-1">
          {s.latestMemoContent ?? '—'}
        </p>
        <button
          onClick={(e) => {
            // row 클릭 navigate가 함께 발동하지 않도록 전파를 막는다.
            e.stopPropagation();
            actions.onMemo(s);
          }}
          className="shrink-0 p-1 rounded-md leading-none text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="메모 보기"
        >
          <span className="material-symbols-outlined text-base">sticky_note_2</span>
        </button>
      </div>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    width: '12%',
    align: 'right',
    locked: true,
    render: (s, actions) => <ActionButtons student={s} actions={actions} />,
  },
];

// Actions 셀 — isAdmin() 호출이 있어 컬럼 정의 안의 인라인 JSX 대신 컴포넌트로 둔다.
function ActionButtons({
  student,
  actions,
}: {
  student: StudentManageTableRow;
  actions: RowActions;
}) {
  const admin = isAdmin();
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          actions.onEdit(student);
        }}
        className="bg-primary/10 text-primary px-1 py-1 rounded-md text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
      </button>
      {admin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            actions.onDelete(student);
          }}
          className="p-1.5 text-on-surface-variant leading-none hover:text-error transition-colors items-center"
        >
          <span className="material-symbols-outlined text-xl">delete</span>
        </button>
      )}
    </div>
  );
}

function sortStudents(
  data: StudentManageTableRow[],
  key: SortKey,
  dir: SortDir,
): StudentManageTableRow[] {
  return [...data].sort((a, b) => {
    const av = key === 'accuracy' ? parseFloat(a[key] ?? '0') : (a[key] as number | string);
    const bv = key === 'accuracy' ? parseFloat(b[key] ?? '0') : (b[key] as number | string);
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

interface StudentTableProps {
  students: StudentManageTableRow[];
  actions: RowActions;
  // 숨긴 컬럼 key 목록. 상태 자체는 StudentManagePage가 소유한다.
  hiddenColumns: string[];
}

export function StudentTable({ students, actions, hiddenColumns }: StudentTableProps) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const hidden = new Set(hiddenColumns);

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

  const visibleColumns = COLUMNS.filter((c) => !hidden.has(c.key));

  return (
    <TableContainer>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            {visibleColumns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            {/* 모든 th 공통 스타일(패딩·텍스트·구분선)은 [&>th]: 셀렉터로 tr에 한 번만 둔다.
                  정렬·마지막 셀 구분선 제거만 개별 th에 남는다. */}
            <tr className="bg-surface-container-highest/30 [&>th]:px-4 [&>th]:py-4 [&>th]:text-[10px] [&>th]:font-bold [&>th]:text-on-surface-variant [&>th]:uppercase [&>th]:tracking-widest [&>th]:border-r [&>th]:border-outline-variant/20 [&>th:last-child]:border-r-0">
              {visibleColumns.map((c) => (
                <th
                  key={c.key}
                  onClick={c.sortKey ? () => handleSort(c.sortKey!) : undefined}
                  className={`${ALIGN_CLASS[c.align] ?? ''} ${
                    c.sortKey
                      ? 'cursor-pointer select-none hover:text-primary transition-colors'
                      : ''
                  }`}
                >
                  <span className="inline-flex items-center">
                    {c.label}
                    {c.sortKey && (
                      <span
                        className="material-symbols-outlined leading-none"
                        style={{ fontSize: '12px' }}
                      >
                        {sortKey === c.sortKey
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
              <tr
                key={student.id}
                onClick={() =>
                  navigate({
                    to: '/teacher/students/$studentId',
                    params: { studentId: String(student.id) },
                  })
                }
                className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer [&>td]:px-4 [&>td]:py-4 [&>td]:border-r [&>td]:border-outline-variant/20 [&>td:last-child]:border-r-0"
              >
                {visibleColumns.map((c) => (
                  <td key={c.key} className={ALIGN_CLASS[c.align]}>
                    {c.render(student, actions)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableContainer>
  );
}
