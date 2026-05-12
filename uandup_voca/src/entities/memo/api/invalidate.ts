import type { QueryClient } from '@tanstack/react-query';
import { memoKeys } from './queryKeys';
import { studentKeys } from '@/entities/student/@x/memo';
import { clinicKeys } from '@/entities/clinic/@x/memo';

/**
 * 메모 변경은 메모 목록 외에도 학생/클리닉 카드의 latestMemo 표시에 영향을 준다.
 */
export function invalidateMemoCascade(qc: QueryClient, studentId: number) {
  qc.invalidateQueries({ queryKey: memoKeys.byStudent(studentId) });
  qc.invalidateQueries({ queryKey: studentKeys.all });
  qc.invalidateQueries({ queryKey: clinicKeys.all });
}
