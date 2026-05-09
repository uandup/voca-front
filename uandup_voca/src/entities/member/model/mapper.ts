import type { components } from '@/shared/api/schema.gen';
import type { WordTestType } from '@/entities/test/@x/member';
import type {
  PendingStudent,
  PendingTeacher,
  PendingParent,
  TeacherRow,
  TeacherManageRow,
  ParentManageRow,
  StudentManageTableRow,
  StudentDetail,
  StudentGrade,
} from './types';

type PendingStudentResponse = components['schemas']['PendingStudentResponse'];
type PendingTeacherResponse = components['schemas']['PendingTeacherResponse'];
type PendingParentResponse = components['schemas']['PendingParentResponse'];
type TeacherListResponse = components['schemas']['TeacherListResponse'];
type ParentListResponse = components['schemas']['ParentListResponse'];
type StudentListResponse = components['schemas']['StudentListResponse'];
type StudentDetailResponse = components['schemas']['StudentDetailResponse'];

const SUBTYPE_MAP: Record<string, WordTestType> = {
  MEANING_TO_WORD: 'meaning-to-word',
  WORD_TO_MEANING: 'word-to-meaning',
};

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
      grade: (s.grade ?? 1) as StudentGrade,
    })),
  };
}

export function toStudentManageTableRow(r: StudentListResponse): StudentManageTableRow {
  const [nameFirstEn = '', nameLastEn = ''] = (r.englishName ?? '').split(' ');
  const testType: WordTestType = SUBTYPE_MAP[r.subType ?? ''] ?? 'word-to-meaning';
  const recentScore =
    r.recentScore != null && r.recentScoreTotal != null
      ? { score: r.recentScore, total: r.recentScoreTotal }
      : null;
  const accuracy = r.acr != null ? `${Math.round(r.acr * 100)}%` : undefined;

  return {
    id: r.studentId!,
    nameKo: r.name ?? '',
    nameFirstEn,
    nameLastEn,
    grade: (r.grade ?? 1) as StudentGrade,
    classes: (r.classrooms ?? []).map((c) => c.className ?? ''),
    assignedLevel: (r.level ?? 1) as StudentManageTableRow['assignedLevel'],
    assignedWordCount: r.assignmentQty ?? 0,
    testQuestionCount: r.testItemCount ?? 0,
    testConfig: { type: testType, includeSynonyms: r.includeSynonym ?? false },
    recentScore,
    accuracy,
    latestMemoContent: r.recentMemo?.content ?? null,
    memos: [],
  };
}

export function toStudentDetail(r: StudentDetailResponse): StudentDetail {
  const [nameFirstEn = '', nameLastEn = ''] = (r.englishName ?? '').split(' ');
  const testType: WordTestType = SUBTYPE_MAP[r.examSubType ?? ''] ?? 'word-to-meaning';

  return {
    id: r.studentId!,
    nameKo: r.name ?? '',
    nameFirstEn,
    nameLastEn,
    grade: (r.grade ?? 1) as StudentGrade,
    level: (r.level ?? 1) as StudentDetail['level'],
    assignmentCount: r.assignmentCount ?? 0,
    examQuestionCount: r.examQuestionCount ?? 0,
    testConfig: { type: testType, includeSynonyms: r.synonymIncluded ?? false },
    classrooms: (r.classrooms ?? []).map((c) => ({ id: c.classId!, name: c.className ?? '' })),
    parents: (r.parents ?? []).map((p) => ({
      id: p.parentId!,
      name: p.name ?? '',
      phoneNumber: p.phoneNumber ?? '',
    })),
  };
}
