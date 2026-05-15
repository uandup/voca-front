import type { StudentGrade } from '@/entities/member';

export interface ClinicMemberStudent {
  id: number;
  nameKo: string;
  englishName: string;
  grade: StudentGrade | null;
}
