import { useNavigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { TableContainer } from '@/shared/ui/TableContainer';
import { ColumnToggleDropdown, type ColumnToggleOption } from '@/shared/ui/ColumnToggleDropdown';
import { usePersistentState } from '@/shared/lib/usePersistentState';
import { LevelBlock } from '@/entities/word';
import { TestConfigBadges } from '@/entities/test';
import type { ClinicStudentRow } from '@/entities/clinic';

interface Props {
  students: ClinicStudentRow[];
  onMemoClick: (student: ClinicStudentRow) => void;
  onEditMembersClick: () => void;
}

// 한 컬럼의 단일 정의 — colgroup / thead / tbody를 이 배열 하나에서 파생시켜
// 컬럼 추가·삭제·숨김 시 한 곳만 고치면 세 위치가 자동으로 동기화된다.
interface ColumnDef {
  key: string;
  label: string;
  // table-fixed에서 <col>의 선호 너비. 숨겨진 컬럼을 빼면 남은 합이 100% 미만이 되고,
  // 브라우저가 남은 공간을 각 <col> 너비 비율대로 재분배한다(별도 정규화 불필요).
  width: string;
  align: 'left' | 'center';
  // Name처럼 행 식별에 필수라 숨길 수 없는 컬럼.
  locked?: boolean;
  // 행 셀 내용 렌더러.
  render: (student: ClinicStudentRow) => ReactNode;
}

const COLUMNS: ColumnDef[] = [
  {
    key: 'name',
    label: 'Name',
    width: '15%',
    align: 'left',
    locked: true,
    render: (s) => (
      <>
        <p className="font-headline font-bold text-sm text-primary">{s.nameKo}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {s.nameFirstEn} {s.nameLastEn}
        </p>
      </>
    ),
  },
  {
    key: 'grade',
    label: 'Grade',
    width: '8%',
    align: 'center',
    render: (s) => (
      <span className="px-2 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-full">
        G{s.grade}
      </span>
    ),
  },
  {
    key: 'level',
    label: 'Level',
    width: '8%',
    align: 'center',
    render: (s) => (
      <div className="flex justify-center">
        <LevelBlock level={s.assignedLevel} />
      </div>
    ),
  },
  {
    key: 'qty',
    label: 'QTY',
    width: '8%',
    align: 'center',
    render: (s) => (
      <span className="font-headline font-bold text-sm text-on-surface">{s.assignedWordCount}</span>
    ),
  },
  {
    key: 'test',
    label: 'Test',
    width: '8%',
    align: 'center',
    render: (s) => (
      <span className="font-headline font-bold text-sm text-on-surface">{s.testQuestionCount}</span>
    ),
  },
  {
    key: 'config',
    label: 'Config',
    width: '15%',
    align: 'center',
    render: (s) => (
      <div className="flex justify-center">
        <TestConfigBadges config={s.testConfig} />
      </div>
    ),
  },
];

// Memo 컬럼은 메모 버튼(이벤트 전파 차단)이 필요해 render 시그니처가 다르므로 별도로 둔다.
const MEMO_COLUMN = { key: 'memo', label: 'Memo', width: '38%' } as const;

const STORAGE_KEY = 'clinic-student-table:hidden-columns';

export function StudentTable({ students, onMemoClick, onEditMembersClick }: Props) {
  const navigate = useNavigate();

  // 숨긴 컬럼 key 목록을 localStorage에 영속화 — 새로고침·재방문 후에도 유지된다.
  const [hiddenKeys, setHiddenKeys] = usePersistentState<string[]>(STORAGE_KEY, []);
  const hidden = new Set(hiddenKeys);

  function toggleColumn(key: string) {
    setHiddenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const allColumns = [...COLUMNS, MEMO_COLUMN];
  const toggleOptions: ColumnToggleOption[] = allColumns.map((c) => ({
    key: c.key,
    label: c.label,
    locked: 'locked' in c ? c.locked : false,
  }));
  const visibleKeys = new Set(allColumns.filter((c) => !hidden.has(c.key)).map((c) => c.key));

  const visibleColumns = COLUMNS.filter((c) => visibleKeys.has(c.key));
  const memoVisible = visibleKeys.has(MEMO_COLUMN.key);
  // colgroup·thead·tbody가 공유하는 최종 컬럼 순서(width 포함).
  const layout = [
    ...visibleColumns.map((c) => ({ key: c.key, width: c.width })),
    ...(memoVisible ? [{ key: MEMO_COLUMN.key, width: MEMO_COLUMN.width }] : []),
  ];

  return (
    <div className="col-span-11 space-y-4">
      <div className="flex justify-end gap-2">
        <ColumnToggleDropdown
          options={toggleOptions}
          visible={visibleKeys}
          onToggle={toggleColumn}
        />
        <button
          onClick={onEditMembersClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-on-primary-fixed-variant bg-surface-container-lowest border/20 shadow-sm hover:bg-surface-container-low transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Edit Members
        </button>
      </div>
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              {layout.map((c) => (
                <col key={c.key} style={{ width: c.width }} />
              ))}
            </colgroup>
            <thead>
              {/* 모든 th 공통 스타일(패딩·텍스트·구분선)은 [&>th]: 셀렉터로 tr에 한 번만 둔다.
                  정렬과 마지막 셀의 구분선 제거만 개별 th에 남는다. */}
              <tr className="bg-surface-container-highest/30 [&>th]:px-4 [&>th]:py-4 [&>th]:text-[10px] [&>th]:font-bold [&>th]:text-on-surface-variant [&>th]:uppercase [&>th]:tracking-widest [&>th]:border-r [&>th]:border-outline-variant/20 [&>th:last-child]:border-r-0">
                {visibleColumns.map((c) => (
                  <th key={c.key} className={c.align === 'center' ? 'text-center' : undefined}>
                    {c.label}
                  </th>
                ))}
                {memoVisible && <th>{MEMO_COLUMN.label}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {students.map((student) => (
                <tr
                  key={student.id}
                  onClick={() =>
                    navigate({
                      to: '/teacher/clinics/students/$studentId',
                      params: { studentId: String(student.id) },
                    })
                  }
                  className="transition-colors group hover:bg-surface-container-low/30 cursor-pointer [&>td]:px-4 [&>td]:py-4 [&>td]:border-r [&>td]:border-outline-variant/20 [&>td:last-child]:border-r-0"
                >
                  {visibleColumns.map((c) => (
                    <td key={c.key} className={c.align === 'center' ? 'text-center' : undefined}>
                      {c.render(student)}
                    </td>
                  ))}
                  {memoVisible && (
                    <td>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs text-on-surface-variant truncate flex-1">
                          {student.latestMemoContent ?? '—'}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMemoClick(student);
                          }}
                          className="shrink-0 p-1 rounded-md leading-none text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">sticky_note_2</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>
    </div>
  );
}
