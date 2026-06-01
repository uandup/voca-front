import type { components } from '@/shared/api/schema.gen';
import type { StudentGrade } from '@/entities/member';
import type { PendingStudent, PendingTeacher, PendingParent } from './types';

type PendingStudentResponse = components['schemas']['PendingStudentResponse'];
type PendingTeacherResponse = components['schemas']['PendingTeacherResponse'];
type PendingParentResponse = components['schemas']['PendingParentResponse'];

export function toPendingStudent(r: PendingStudentResponse): PendingStudent {
  return {
    id: r.studentId!,
    name: r.name ?? '',
    englishName: r.englishName ?? '',
    grade: (r.grade ?? 1) as StudentGrade,
    submittedAt: r.createdAt ?? '',
  };
}

export function toPendingTeacher(r: PendingTeacherResponse): PendingTeacher {
  return {
    id: r.teacherId!,
    name: r.name ?? '',
    englishName: r.englishName ?? '',
    submittedAt: r.createdAt ?? '',
  };
}

export function toPendingParent(r: PendingParentResponse): PendingParent {
  return {
    id: r.parentId!,
    name: r.name ?? '',
    phoneNumber: r.phoneNumber ?? '',
    requestedChildren: (r.requestedChildren ?? []).map((c) => ({
      name: c.name ?? '',
      grade: c.grade ?? 0,
    })),
    submittedAt: r.createdAt ?? '',
  };
}
