import type { MemberRole } from '@/entities/member';
import type { StudentFormState, TeacherFormState, ParentFormState } from './types';

export const EXAM_BADGES = [
  'MAP',
  'Junior TOEFL',
  'TOEFL',
  'SSAT',
  'ISEE',
  'SAT',
  'AP Lang',
  'IB English',
] as const;

export const INITIAL_STUDENT: StudentFormState = {
  nameKo: '',
  nameLastEn: '',
  nameFirstEn: '',
  grade: 1,
};

export const INITIAL_TEACHER: TeacherFormState = {
  nameKo: '',
  nameLastEn: '',
  nameFirstEn: '',
};

export const INITIAL_PARENT: ParentFormState = {
  nameKo: '',
  phone: '',
  phoneConsent: false,
  // 자녀 최소 1명 — 첫 행은 기본 제공한다.
  children: [{ nameKo: '', grade: 1 }],
};

export const USER_TYPE_OPTIONS: { value: MemberRole; label: string; icon: string }[] = [
  { value: 'STUDENT', label: 'Student', icon: 'school' },
  { value: 'PARENT', label: 'Parent', icon: 'family_restroom' },
  { value: 'TEACHER', label: 'Teacher', icon: 'person_book' },
];
