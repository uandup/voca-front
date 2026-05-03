import type { PendingStudent, PendingParent, PendingTeacher } from '@/entities/member';

export type StudentFormState = Pick<
  PendingStudent,
  'nameKo' | 'nameLastEn' | 'nameFirstEn' | 'grade'
>;

export type TeacherFormState = Pick<PendingTeacher, 'nameKo' | 'nameLastEn' | 'nameFirstEn'>;

export type ParentFormState = Pick<PendingParent, 'nameKo' | 'phone'> & {
  phoneConsent: boolean;
  childNameKo: string;
  childGrade: string;
};
