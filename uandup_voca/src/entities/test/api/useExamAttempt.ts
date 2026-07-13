import { useEffect, useRef, useState } from 'react';
import { attemptExam } from './testApi';
import { toExamAttemptData } from '../model/mapper';
import type { ExamAttemptData } from '../model/types';

interface ExamAttemptState {
  data?: ExamAttemptData;
  error?: unknown;
  loading: boolean;
}

// 응시용 시험을 가져오는 훅.
// attempt는 상태를 바꾸는 POST라(두 번째 호출 = 400 EXAM_ALREADY_ATTEMPTED로 포기 확정),
// useQuery의 refetch(window focus·remount)로 재호출되면 안 된다. ref 가드 + 순수 effect로
// 페이지 진입 시 정확히 1회만 호출한다. StrictMode의 effect 이중 호출도 같은 fiber라 ref가 막는다.
export function useExamAttempt(examId: number): ExamAttemptState {
  const [state, setState] = useState<ExamAttemptState>({ loading: true });
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    attemptExam(examId)
      .then((res) => setState({ data: toExamAttemptData(res.data!), loading: false }))
      .catch((error) => setState({ error, loading: false }));
  }, [examId]);

  return state;
}
