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
// 정확히 1회만 호출한다. StrictMode의 effect 이중 호출도 같은 fiber라 ref가 막는다.
//
// enabled: 이 POST는 곧 "응시 확정(재응시 불가)"이므로 페이지 진입 즉시가 아니라, 학생이
// 시작 게이트에서 명시적으로 "Start Exam"을 누른 순간(enabled=true)에만 발사한다. 그래야
// 실수 진입이나 준비 전 클릭으로 시험이 소진되지 않는다. enabled 전에는 loading도 false다.
export function useExamAttempt(examId: number, enabled: boolean): ExamAttemptState {
  const [state, setState] = useState<ExamAttemptState>({ loading: false });
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled || firedRef.current) return;
    firedRef.current = true;
    setState({ loading: true });
    attemptExam(examId)
      .then((res) => setState({ data: toExamAttemptData(res.data!), loading: false }))
      .catch((error) => setState({ error, loading: false }));
  }, [examId, enabled]);

  return state;
}
