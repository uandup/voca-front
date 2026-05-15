import type { components } from '@/shared/api/schema.gen';
import type { StudentGrade } from '@/entities/member';
import type { ParentManageRow } from './types';

type ParentListResponse = components['schemas']['ParentListResponse'];

export function toParentManageRow(r: ParentListResponse): ParentManageRow {
  return {
    id: r.parentId!,
    name: r.name ?? '',
    phoneNumber: r.phoneNumber ?? '',
    students: (r.students ?? []).map((s) => ({
      id: s.studentId!,
      name: s.name ?? '',
      grade: (s.grade ?? 1) as StudentGrade,
    })),
  };
}
