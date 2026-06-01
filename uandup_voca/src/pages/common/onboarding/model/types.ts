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

/** 학부모 가입 폼에서 입력하는 자녀 1명의 희망 정보. */
export interface ChildFormEntry {
  nameKo: string;
  grade: StudentGrade;
}

export interface ParentFormState {
  nameKo: string;
  phone: string;
  phoneConsent: boolean;
  // 자녀 희망 정보 — 최소 1명. 관리자가 승인 시 실제 학생과 매칭한다.
  children: ChildFormEntry[];
}
