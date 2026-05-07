import type { components } from '@/shared/api/schema.gen';
import type { PendingStudent, PendingTeacher, PendingParent, TeacherRow } from './types';

type PendingStudentResponse = components['schemas']['PendingStudentResponse'];
type PendingTeacherResponse = components['schemas']['PendingTeacherResponse'];
type PendingParentResponse = components['schemas']['PendingParentResponse'];
type TeacherListResponse = components['schemas']['TeacherListResponse'];

export function toPendingStudent(r: PendingStudentResponse): PendingStudent {
  return {
    id: r.studentId!,
    name: r.name ?? '',
    englishName: r.englishName ?? '',
    grade: r.grade ?? 0,
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
    requestedChildName: r.requestedChildName ?? '',
    requestedChildGrade: r.requestedChildGrade ?? 0,
    submittedAt: r.createdAt ?? '',
  };
}

export function toTeacherRow(r: TeacherListResponse): TeacherRow {
  return {
    id: r.teacherId!,
    name: r.name ?? '',
    englishName: r.englishName ?? '',
    isAdmin: r.isAdmin ?? false,
  };
}
