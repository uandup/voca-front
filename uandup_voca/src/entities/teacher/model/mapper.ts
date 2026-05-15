import type { components } from '@/shared/api/schema.gen';
import type { TeacherRow, TeacherManageRow } from './types';

type TeacherListResponse = components['schemas']['TeacherListResponse'];

export function toTeacherRow(r: TeacherListResponse): TeacherRow {
  return {
    id: r.teacherId!,
    name: r.name ?? '',
    englishName: r.englishName ?? '',
    isAdmin: r.isAdmin ?? false,
  };
}

export function toTeacherManageRow(r: TeacherListResponse): TeacherManageRow {
  const [nameFirstEn = '', nameLastEn = ''] = (r.englishName ?? '').split(' ');
  return {
    id: r.teacherId!,
    name: r.name ?? '',
    nameFirstEn,
    nameLastEn,
    isAdmin: r.isAdmin ?? false,
  };
}
