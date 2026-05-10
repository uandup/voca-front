import type { StudentFormState, TeacherFormState, ParentFormState } from '../model/types';

export function isStudentValid(f: StudentFormState) {
  return !!(f.nameKo && f.nameLastEn && f.nameFirstEn && f.grade);
}

export function isTeacherValid(f: TeacherFormState) {
  return !!f.nameKo;
}

export function isParentValid(f: ParentFormState) {
  return !!(f.nameKo && f.phone && f.phoneConsent && f.childNameKo && f.childGrade);
}
