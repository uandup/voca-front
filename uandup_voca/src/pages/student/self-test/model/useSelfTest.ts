import { useState } from 'react';
import { ITEMS_PER_PAGE } from '@/entities/test';
import type { WordCardData } from '@/entities/word';
import type { Answer } from '@/widgets/test-online';
import type { SelfTestConfig, SelfTestPhase, SelfTestSession } from './types';
import {
  clampQuestionCount,
  getQuestionCountError,
  pickSelfTestQuestions,
  toSelfTestReviewItems,
} from './selfTestQuestions';

interface UseSelfTestParams {
  words: WordCardData[];
  // 선생님이 정한 실제 시험 설정. overview를 받지 못했으면 undefined → 기본값으로 대체.
  realSettings?: SelfTestConfig;
}

// 자체 시험 페이지의 상태를 전부 소유하는 훅. 서버 호출은 하지 않는다(읽기 데이터는 인자로 받음).
export function useSelfTest({ words, realSettings }: UseSelfTestParams) {
  // 학생이 설정 화면에서 바꾼 항목만 담는다. 실제 설정은 파생값으로 계산하므로
  // overview가 늦게 도착해도 useEffect로 동기화할 필요가 없고, Reset은 빈 객체로 되돌리기만 하면 된다.
  // 저장하지 않는다 — 다음에 들어오면 다시 실제 시험 설정으로 시작한다.
  const [override, setOverride] = useState<Partial<SelfTestConfig>>({});
  // null = 설정 화면. Start를 누르는 순간 설정과 문제를 함께 고정한다.
  const [session, setSession] = useState<SelfTestSession | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // phase를 별도 state로 두지 않고 파생한다 — "testing인데 문제가 없음" 같은 불가능한 상태가 생기지 않는다.
  const phase: SelfTestPhase = !session ? 'setup' : isChecked ? 'checked' : 'testing';

  // --- 설정 ---
  const wordCount = words.length;
  const realConfig: SelfTestConfig = {
    testType: realSettings?.testType ?? 'word-to-meaning',
    // 선생님 설정이 없으면 전체 단어로 시험.
    questionCount: clampQuestionCount(realSettings?.questionCount ?? wordCount, wordCount),
    includeSynonyms: realSettings?.includeSynonyms ?? false,
  };
  const config: SelfTestConfig = { ...realConfig, ...override };
  // override에 키가 있어도 값이 실제 설정과 같으면 "수정 안 함"으로 본다.
  const isCustomized =
    config.testType !== realConfig.testType ||
    config.questionCount !== realConfig.questionCount ||
    config.includeSynonyms !== realConfig.includeSynonyms;
  const questionCountError = getQuestionCountError(config.questionCount, wordCount);

  function updateConfig(patch: Partial<SelfTestConfig>) {
    setOverride((prev) => ({ ...prev, ...patch }));
  }

  function resetConfig() {
    setOverride({});
  }

  // --- 응시 ---
  const questions = session?.questions ?? [];
  const showSynonym = session?.config.includeSynonyms ?? false;
  const totalItems = questions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = questions.slice(pageStart, pageStart + ITEMS_PER_PAGE);
  const reviewPageItems = toSelfTestReviewItems(pageItems);
  const allIds = questions.map((q) => q.id);

  function handleAnswerChange(id: number, field: keyof Answer, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  // "completed" 판정은 실제 시험(VocabAnswerRow)과 같다 — 동의어 포함 시 둘 다 채워야 완료.
  const completedIds = new Set<number>(
    Object.entries(answers)
      .filter(([, v]) => {
        const meaningFilled = (v.answer ?? '').trim() !== '';
        const synonymFilled = (v.synonym ?? '').trim() !== '';
        return showSynonym ? meaningFilled && synonymFilled : meaningFilled;
      })
      .map(([k]) => Number(k)),
  );

  // 한 글자라도 입력했는지 — 나가기 확인 모달을 띄울지 결정한다(빈 시험은 바로 나가도 잃을 게 없다).
  const hasAnyAnswer = Object.values(answers).some(
    (v) => (v.answer ?? '').trim() !== '' || (v.synonym ?? '').trim() !== '',
  );

  function start() {
    if (questionCountError) return;
    setSession({ config, questions: pickSelfTestQuestions(words, config.questionCount) });
    setIsChecked(false);
    setAnswers({});
    setWrongIds(new Set());
    setCurrentPage(1);
  }

  // 정답 공개. 자동 채점은 하지 않는다 — 뜻 서술형은 기계로 판정하기 어려워 학생이 직접 오답을 표시한다.
  function check() {
    setIsChecked(true);
    setCurrentPage(1);
  }

  // 설정 화면으로 복귀. 학생이 바꾼 설정(override)은 유지하고, 다음 Start 때 문제를 새로 뽑는다.
  function retry() {
    setSession(null);
    setIsChecked(false);
  }

  function toggleWrong(id: number) {
    setWrongIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return {
    phase,
    // 설정
    wordCount,
    config,
    isCustomized,
    questionCountError,
    updateConfig,
    resetConfig,
    // 응시
    testType: session?.config.testType ?? config.testType,
    showSynonym,
    answers,
    handleAnswerChange,
    completedIds,
    hasAnyAnswer,
    wrongIds,
    toggleWrong,
    // 페이지
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    pageItems,
    reviewPageItems,
    allIds,
    // 전환
    start,
    check,
    retry,
  };
}
