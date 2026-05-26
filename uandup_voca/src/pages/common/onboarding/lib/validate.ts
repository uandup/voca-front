import type { StudentFormState, TeacherFormState, ParentFormState } from '../model/types';

export function isStudentValid(f: StudentFormState) {
  return !!(f.nameKo && f.nameLastEn && f.nameFirstEn && f.grade);
}

export function isTeacherValid(f: TeacherFormState) {
  return !!f.nameKo;
}

export function isParentValid(f: ParentFormState) {
  // 자녀는 최소 1명, 모든 행이 이름·학년을 갖춰야 한다.
  const childrenValid = f.children.length > 0 && f.children.every((c) => !!c.nameKo && !!c.grade);
  return !!(f.nameKo && f.phone && f.phoneConsent && childrenValid);
}
