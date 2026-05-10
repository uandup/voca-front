import type { components } from '@/shared/api/schema.gen';
import type { ClinicMemberStudent } from './types';

type ClinicStudentEditItem = components['schemas']['ClinicStudentEditItem'];

export function toClinicMemberStudent(item: ClinicStudentEditItem): ClinicMemberStudent {
  return {
    id: item.studentId ?? 0,
    nameKo: item.name ?? '',
    englishName: item.englishName ?? '',
    grade: null,
  };
}
