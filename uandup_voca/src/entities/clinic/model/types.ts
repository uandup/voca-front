import type { StudentIdentity } from '@/entities/student/@x/clinic';
import type { StudentGrade } from '@/entities/member/@x/clinic';
import type { WordDifficultyLevel } from '@/entities/word/@x/clinic';
import type { TestConfig } from '@/entities/test/@x/clinic';

export type ClinicStudentRow = StudentIdentity & {
  grade: StudentGrade;
  assignedLevel: WordDifficultyLevel;
  assignedWordCount: number;
  testQuestionCount: number;
  testConfig: TestConfig;
  latestMemoContent: string | null;
};
