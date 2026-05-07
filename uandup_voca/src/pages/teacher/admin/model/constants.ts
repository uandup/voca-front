export type AdminModalKey =
  | 'pending'
  | 'class'
  | 'teacher'
  | 'grade'
  | 'teacher-manage'
  | 'parent-manage';

export interface AdminCardConfig {
  key: AdminModalKey;
  icon: string;
  label: string;
  description: string;
  /** null이면 AdminPage에서 동적으로 주입 */
  stat: string | null;
  dark: boolean;
}

export const ADMIN_CARDS: AdminCardConfig[] = [
  {
    key: 'pending',
    icon: 'person_add',
    label: 'Pending Approvals',
    description: 'waiting',
    stat: null,
    dark: true,
  },
  {
    key: 'class',
    icon: 'school',
    label: 'Class Management',
    description: 'Add / Edit / Delete',
    stat: 'Class',
    dark: false,
  },
  {
    key: 'teacher',
    icon: 'manage_accounts',
    label: 'Teacher Permissions',
    description: 'Manage roles',
    stat: 'Role',
    dark: true,
  },
  {
    key: 'grade',
    icon: 'upgrade',
    label: 'Grade Bulk Update',
    description: 'Bulk adjust',
    stat: '±1',
    dark: false,
  },
  {
    key: 'teacher-manage',
    icon: 'person_edit',
    label: 'Teacher Management',
    description: 'Edit / Delete',
    stat: 'Teachers',
    dark: true,
  },
  {
    key: 'parent-manage',
    icon: 'family_restroom',
    label: 'Parent Management',
    description: 'Edit / Delete',
    stat: 'Parents',
    dark: false,
  },
];
