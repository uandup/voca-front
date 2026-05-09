import type { components } from '@/shared/api/schema.gen';
import type { StudentDetail } from '../model/types';
import { toExamSubType } from '@/entities/test';

type StudentUpdateRequest = components['schemas']['StudentUpdateRequest'];

export function toStudentUpdateRequest(detail: StudentDetail): StudentUpdateRequest {
  return {
    name: detail.nameKo,
    englishName: `${detail.nameFirstEn} ${detail.nameLastEn}`.trim(),
    grade: detail.grade,
    assignmentCount: detail.assignmentCount,
    examQuestionCount: detail.examQuestionCount,
    examSubType: toExamSubType(detail.testConfig.type),
    synonymIncluded: detail.testConfig.includeSynonyms,
    level: detail.level,
    parentIds: detail.parents.map((p) => p.id),
    classroomIds: detail.classrooms.map((c) => c.id),
  };
}
