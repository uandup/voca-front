import type { StudentGrade } from '@/entities/member';

export interface StudentFormState {
  nameKo: string;
  nameLastEn: string;
  nameFirstEn: string;
  grade: StudentGrade;
}

export interface TeacherFormState {
  nameKo: string;
  nameLastEn: string;
  nameFirstEn: string;
}

export interface ParentFormState {
  nameKo: string;
  phone: string;
  phoneConsent: boolean;
  childNameKo: string;
  childGrade: StudentGrade;
}
