import { useCallback, useEffect, useState } from 'react';
import type { ExamDetail, SentenceTestAnswer } from '@/entities/test';
import type { Answer } from '@/widgets/test-online';

interface UseExamAnswersParams {
  examDetail: ExamDetail | undefined;
  isSentence: boolean;
  showSynonym: boolean;
}

// 시험 답안 상태를 관리하는 훅.
// examDetail 로드 시 기존 답안으로 시드하고, 답안 변경 핸들러와 completedIds를 제공한다.
export function useExamAnswers({ examDetail, isSentence, showSynonym }: UseExamAnswersParams) {
  const [vocabAnswers, setVocabAnswers] = useState<Record<number, Answer>>({});
  const [sentenceAnswers, setSentenceAnswers] = useState<Record<number, SentenceTestAnswer>>({});

  // examDetail 로드 시 — 이미 제출했거나 채점 완료된 시험이면 기존 답안으로 시드.
  useEffect(() => {
    if (!examDetail) return;
    if (isSentence) {
      const seeded: Record<number, SentenceTestAnswer> = Object.fromEntries(
        examDetail.items.map((it) => [it.itemOrder, { answer: it.userAnswer ?? '' }]),
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSentenceAnswers(seeded);
    } else {
      const seeded: Record<number, Answer> = Object.fromEntries(
        examDetail.items.map((it) => [
          it.itemOrder,
          { answer: it.userAnswer ?? '', synonym: it.synonymUserAnswers.join(', ') },
        ]),
      );
      setVocabAnswers(seeded);
    }
  }, [examDetail, isSentence]);

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
