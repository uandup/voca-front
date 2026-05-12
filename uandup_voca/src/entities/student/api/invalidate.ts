import type { QueryClient } from '@tanstack/react-query';
import { studentKeys } from './queryKeys';
import { clinicKeys } from '@/entities/clinic/@x/student';

/**
 * 학생 정보(이름·학년·메모·배정·시험 설정 등)가 바뀌었을 때 함께 갱신해야 하는 캐시들.
 * 학생 도메인이 외부 도메인(클리닉)에 미치는 영향까지 한 곳에서 관리한다.
 */
export function invalidateStudentCascade(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: studentKeys.all });
  qc.invalidateQueries({ queryKey: clinicKeys.all });
}
