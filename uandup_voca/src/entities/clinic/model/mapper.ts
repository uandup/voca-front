import type { components } from '@/shared/api/schema.gen';
import type { ClinicStudentRow, StudentGrade } from '@/entities/member';
import type { WordDifficultyLevel } from '@/entities/word';

type ClinicStudentListResponse = components['schemas']['ClinicStudentListResponse'];
type ClinicStudentEditItem = components['schemas']['ClinicStudentEditItem'];

export interface ClinicMemberStudent {
  id: number;
  nameKo: string;
  englishName: string;
  grade: StudentGrade | null;
}

export function toClinicMemberStudent(item: ClinicStudentEditItem): ClinicMemberStudent {
  return {
    id: item.studentId ?? 0,
    nameKo: item.name ?? '',
    englishName: item.englishName ?? '',
    grade: null,
  };
}

function toTestType(
  subType: ClinicStudentListResponse['subType'],
): 'word-to-meaning' | 'meaning-to-word' {
  return subType === 'WORD_TO_MEANING' ? 'word-to-meaning' : 'meaning-to-word';
}

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
      type: toTestType(res.subType),
      includeSynonyms: res.includeSynonym ?? false,
    },
    latestMemoContent: res.recentMemo?.content ?? null,
    memos: [],
  };
}
