import type { PendingStudent, PendingParent, PendingTeacher } from '@/entities/member';

export type StudentFormState = Pick<
  PendingStudent,
  'nameLastKo' | 'nameFirstKo' | 'nameLastEn' | 'nameFirstEn' | 'grade'
>;

export type TeacherFormState = Pick<
  PendingTeacher,
  'nameLastKo' | 'nameFirstKo' | 'nameLastEn' | 'nameFirstEn'
>;

export type ParentFormState = Pick<PendingParent, 'nameLastKo' | 'nameFirstKo' | 'phone'> & {
  phoneConsent: boolean;
  childNameLastKo: string;
  childNameFirstKo: string;
  childGrade: string;
};
