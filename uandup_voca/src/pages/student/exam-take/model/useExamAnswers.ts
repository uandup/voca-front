import { useCallback, useState } from 'react';
import type { SentenceTestAnswer } from '@/entities/test';
import type { Answer } from '@/widgets/test-online';

interface UseExamAnswersParams {
  isSentence: boolean;
  showSynonym: boolean;
}

// 시험 답안 상태를 관리하는 훅.
// 응시용(attempt)은 이전 답안이 없으므로 빈 상태로 시작하고, 답안 변경 핸들러와 completedIds를 제공한다.
export function useExamAnswers({ isSentence, showSynonym }: UseExamAnswersParams) {
  const [vocabAnswers, setVocabAnswers] = useState<Record<number, Answer>>({});
  const [sentenceAnswers, setSentenceAnswers] = useState<Record<number, SentenceTestAnswer>>({});

  const handleVocabChange = useCallback((id: number, field: keyof Answer, value: string) => {
    setVocabAnswers((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }, []);

  const handleSentenceChange = useCallback((id: number, value: string) => {
    setSentenceAnswers((prev) => ({ ...prev, [id]: { answer: value } }));
  }, []);

  // answer mode에서 "completed" 판정: 입력값이 있으면 완료.
  // vocab의 경우 showSynonym=true면 synonym까지 채워야 완료로 본다 (VocabAnswerRow와 동일 로직).
  const completedIds = new Set<number>(
    isSentence
      ? Object.entries(sentenceAnswers)
          .filter(([, v]) => (v.answer ?? '').trim() !== '')
          .map(([k]) => Number(k))
      : Object.entries(vocabAnswers)
          .filter(([, v]) => {
            const meaningFilled = (v.answer ?? '').trim() !== '';
            const synonymFilled = (v.synonym ?? '').trim() !== '';
            return showSynonym ? meaningFilled && synonymFilled : meaningFilled;
          })
          .map(([k]) => Number(k)),
  );

  return {
    vocabAnswers,
    sentenceAnswers,
    handleVocabChange,
    handleSentenceChange,
    completedIds,
  };
}
