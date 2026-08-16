import { useEffect, useRef, useState } from 'react';
import { attemptPersonalExam } from './personalExamApi';
import { toPersonalExamAttemptData } from '../model/mapper';
import type { ExamAttemptData } from '@/entities/test/@x/personal-exam';

interface PersonalExamAttemptState {
  data?: ExamAttemptData;
  error?: unknown;
  loading: boolean;
}

// 응시용 시험을 가져오는 훅 — entities/test의 useExamAttempt와 동일한 이유로 동일하게 구현한다.
// attempt는 상태를 바꾸는 POST라(두 번째 호출 = 재응시 취급) useQuery의 refetch(window focus·
// remount)로 재호출되면 안 된다. ref 가드 + 순수 effect로 정확히 1회만 호출한다.
//
// enabled: 학생이 시작 게이트에서 명시적으로 "Start Exam"을 누른 순간에만 발사한다.
export function usePersonalExamAttempt(
  personalExamId: number,
  enabled: boolean,
): PersonalExamAttemptState {
  const [state, setState] = useState<PersonalExamAttemptState>({ loading: false });
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled || firedRef.current) return;
    firedRef.current = true;
    setState({ loading: true });
    attemptPersonalExam(personalExamId)
      .then((res) => setState({ data: toPersonalExamAttemptData(res.data!), loading: false }))
      .catch((error) => setState({ error, loading: false }));
  }, [personalExamId, enabled]);

  return state;
}
