import type { ColumnToggleOption } from '@/shared/ui/ColumnToggleDropdown';

// 컬럼 토글에 필요한 메타데이터(key·label·locked).
// 실제 컬럼 렌더 정의(COLUMNS)는 render JSX를 포함해 StudentTable.tsx 안에 있지만,
// 토글 UI는 StudentManagePage 헤더로 끌어올려야 하므로 정적 메타데이터만 여기로 분리한다.
// StudentTable.tsx의 COLUMNS와 key·순서가 일치해야 한다.
export const STUDENT_COLUMN_STORAGE_KEY = 'student-manage-table:hidden-columns';

export const STUDENT_COLUMN_OPTIONS: ColumnToggleOption[] = [
  { key: 'name', label: 'Name', locked: true },
  { key: 'grade', label: 'Grade' },
  { key: 'level', label: 'Level' },
  { key: 'qty', label: 'QTY' },
  { key: 'test', label: 'TEST' },
  { key: 'config', label: 'Config' },
  { key: 'recent', label: 'Recent' },
  { key: 'acr', label: 'ACR' },
  { key: 'memo', label: 'Memo' },
  { key: 'actions', label: 'Actions', locked: true },
];
