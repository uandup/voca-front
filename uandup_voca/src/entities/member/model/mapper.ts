import type { components } from '@/shared/api/schema.gen';
import type {
  PendingStudent,
  PendingTeacher,
  PendingParent,
  TeacherRow,
  TeacherManageRow,
  ParentManageRow,
} from './types';

type PendingStudentResponse = components['schemas']['PendingStudentResponse'];
type PendingTeacherResponse = components['schemas']['PendingTeacherResponse'];
type PendingParentResponse = components['schemas']['PendingParentResponse'];
type TeacherListResponse = components['schemas']['TeacherListResponse'];
type ParentListResponse = components['schemas']['ParentListResponse'];

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

export function toParentManageRow(r: ParentListResponse): ParentManageRow {
  return {
    id: r.parentId!,
    name: r.name ?? '',
    phoneNumber: r.phoneNumber ?? '',
    students: (r.students ?? []).map((s) => ({
      id: s.studentId!,
      name: s.name ?? '',
      grade: s.grade ?? 0,
    })),
  };
}
