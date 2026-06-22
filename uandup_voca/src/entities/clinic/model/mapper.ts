import type { components } from '@/shared/api/schema.gen';
import type { StudentGrade } from '@/entities/member/@x/clinic';
import type { WordDifficultyLevel } from '@/entities/word/@x/clinic';
import { toWordTestType } from '@/entities/test/@x/clinic';
import type { ClinicStudentRow } from './types';

type ClinicStudentListResponse = components['schemas']['ClinicStudentListResponse'];

export function toClinicStudentRow(res: ClinicStudentListResponse): ClinicStudentRow {
  const englishName = res.englishName ?? '';
  const parts = englishName.trim().split(' ');
  const nameLastEn = parts.length > 1 ? parts[parts.length - 1] : '';
  const nameFirstEn = parts.length > 1 ? parts.slice(0, -1).join(' ') : englishName;

  return {
    id: res.studentId ?? 0,
    nameKo: res.name ?? '',
    nameFirstEn,
    nameLastEn,
    grade: (res.grade ?? 1) as StudentGrade,
    assignedLevel: (res.level ?? 1) as WordDifficultyLevel,
    assignedWordCount: res.assignmentQty ?? 0,
    testQuestionCount: res.testItemCount ?? 0,
    testConfig: {
      type: toWordTestType(res.subType),
      includeSynonyms: res.includeSynonym ?? false,
    },
    latestMemoContent: res.recentMemo?.content ?? null,
  };
}
