import type { components } from '@/shared/api/schema.gen';
import type { StudentGrade } from '@/entities/member';
import { toWordTestType } from '@/entities/test/@x/student';
import type { StudentManageTableRow, StudentDetail } from './types';

type StudentListResponse = components['schemas']['StudentListResponse'];
type StudentDetailResponse = components['schemas']['StudentDetailResponse'];

export function toStudentManageTableRow(r: StudentListResponse): StudentManageTableRow {
  const [nameFirstEn = '', nameLastEn = ''] = (r.englishName ?? '').split(' ');
  const testType = toWordTestType(r.subType);
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
  const testType = toWordTestType(r.examSubType);

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
