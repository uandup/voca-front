import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams, useSearch } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ConfirmDialog } from '@/shared/ui/Modal/ConfirmDialog';
import { AlertDialog } from '@/shared/ui/Modal/AlertDialog';
import {
  ITEMS_PER_PAGE,
  type ExamType,
  type WordTestType,
  type SentenceTestAnswer,
} from '@/entities/test';
import {
  TestHeader,
  TestPagination,
  ProgressPanel,
  VocabAnswerTable,
  SentenceAnswerTable,
  VocabReviewTable,
  SentenceReviewTable,
  SentencePreviewTable,
} from '@/widgets/test-online';
import type { Answer } from '@/widgets/test-online';
import { useExamDetail } from '@/entities/test';
import { useSubmitExam } from '@/features/exam';
import {
  toWordTestItems,
  toSentenceTestItems,
  toVocabReviewItems,
} from '@/pages/teacher/clinic-detail/model/mapper';
import { useCurrentStudentId } from '@/entities/auth';

// 학생이 시험을 응시하거나 채점된 결과를 확인하는 통합 페이지.
// status === COMPLETED/PASSED/FAILED → review mode(read-only, isCorrect 마커 표시)
// status === SUBMITTED              → submitted mode(read-only, 마커 없음 — 채점 대기)
// 그 외(ONLINE_STARTED 등)          → answer mode(입력 + Submit 가능)

type ExamMode = 'answer' | 'review' | 'submitted';

function inferMode(status: string): ExamMode {
  if (status === 'COMPLETED' || status === 'PASSED' || status === 'FAILED') return 'review';
  if (status === 'SUBMITTED') return 'submitted';
  return 'answer';
}

// review-deck/level-test은 source 라벨을 검증·invalidation에 사용. 라우트 search examType과 매핑.
function inferSource(examType: ExamType | undefined) {
  if (examType === 'REVIEW_DECK') return 'review-deck' as const;
  if (examType === 'LEVEL_TEST') return 'level-test' as const;
  return 'study-set' as const;
}

export default function ExamTakePage() {
  const { examId: examIdParam } = useParams({ from: '/student_/exams/$examId/take' });
  const search = useSearch({ from: '/student_/exams/$examId/take' });
  const router = useRouter();

  const examId = Number(examIdParam);
  const studentId = useCurrentStudentId() ?? 0;
  const { data: examDetail, isLoading } = useExamDetail(examId);

  const examType: ExamType = (search.examType ?? 'WORD') as ExamType;
  const isSentence = examType === 'EXAMPLE';
  const source = inferSource(search.examType);

  const submit = useSubmitExam({ examId, studentId, source });

  const [currentPage, setCurrentPage] = useState(1);
  const [vocabAnswers, setVocabAnswers] = useState<Record<number, Answer>>({});
  const [sentenceAnswers, setSentenceAnswers] = useState<Record<number, SentenceTestAnswer>>({});

  // 미제출 답 확인 모달 (Task 19)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  // 제출 완료 모달 (Task 20)
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

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

  function handleExit() {
    if (search.returnTo) {
      router.history.replace(search.returnTo);
    } else {
      router.history.back();
    }
  }

  // 단어 vocab 결과 모드용 answers map(itemOrder 기준).
  const vocabReviewAnswers: Record<number, Answer> = useMemo(() => {
    if (!examDetail) return {};
    return Object.fromEntries(
      examDetail.items.map((item) => [
        item.itemOrder,
        {
          answer: item.userAnswer ?? '',
          synonym: item.synonymUserAnswers.join(', '),
        },
      ]),
    );
  }, [examDetail]);

  if (isLoading || !examDetail) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <TestHeader onExit={handleExit} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const mode = inferMode(examDetail.status);
  const testType: WordTestType = examDetail.subType ?? 'word-to-meaning';
  const showSynonym = examDetail.includeSynonym;

  const vocabItems = !isSentence ? toWordTestItems(examDetail.items) : [];
  const vocabReviewItems = !isSentence ? toVocabReviewItems(examDetail.items) : [];
  const sentenceItems = isSentence ? toSentenceTestItems(examDetail.items) : [];
  const totalItems = isSentence ? sentenceItems.length : vocabItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const vocabPageItems = vocabItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const vocabReviewPageItems = vocabReviewItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const sentencePageItems = sentenceItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const allIds = isSentence ? sentenceItems.map((i) => i.id) : vocabItems.map((i) => i.id);

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

  // review mode에서 wrong 표시.
  const wrongIds = new Set<number>(
    examDetail.items.filter((i) => i.isCorrect === false).map((i) => i.itemOrder),
  );

  // sentence review용 정답 단어 map — examItem.word가 빈칸을 채울 정답.
  const sentenceCorrectAnswers: Record<number, string> = Object.fromEntries(
    examDetail.items.map((item) => [item.itemOrder, item.word]),
  );

  const isAnswerMode = mode === 'answer';
  const showSubmit = isAnswerMode;

  // itemOrder(클라이언트 키) → examItemId(서버 식별자)로 매핑하여 제출 페이로드 구성.
  function doSubmit() {
    const results = examDetail!.items.map((item) => {
      const order = item.itemOrder;
      if (isSentence) {
        return {
          examItemId: item.examItemId,
          wordAnswer: sentenceAnswers[order]?.answer ?? '',
        };
      }
      const a = vocabAnswers[order];
      return {
        examItemId: item.examItemId,
        wordAnswer: a?.answer ?? '',
        synonymAnswer: a?.synonym ?? '',
      };
    });
    submit.mutate({ results }, { onSuccess: () => setShowSubmitSuccess(true) });
  }

  // 미제출 문항이 있으면 확인 모달을 먼저 표시한다 (Task 19).
  function handleSubmit() {
    if (completedIds.size < totalItems) {
      setShowSubmitConfirm(true);
      return;
    }
    doSubmit();
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TestHeader
        onExit={handleExit}
        onSubmit={showSubmit ? handleSubmit : undefined}
        showWarning={isAnswerMode}
      />

      <div className="relative flex flex-1 justify-center px-6 py-6">
        <div className="w-240 flex flex-col gap-4">
          {/* review: 채점 완료 — isCorrect 마커 표시. */}
          {mode === 'review' ? (
            isSentence ? (
              <SentenceReviewTable
                items={sentencePageItems}
                answers={sentenceAnswers}
                correctAnswers={sentenceCorrectAnswers}
                wrongIds={wrongIds}
                readOnly
                hideCheckbox
                onToggleWrong={() => {}}
              />
            ) : (
              <VocabReviewTable
                items={vocabReviewPageItems}
                testType={testType}
                showSynonym={showSynonym}
                answers={vocabReviewAnswers}
                wrongIds={wrongIds}
                readOnly
                hideCheckbox
                onToggleWrong={() => {}}
              />
            )
          ) : mode === 'submitted' ? (
            /* submitted: 채점 대기 — 정답 없이 학생 제출 답만 read-only로 표시 (Task 21).
               sentence: SentencePreviewRow 재사용(학생 답을 answer prop으로 전달).
               vocab: VocabAnswerTable readOnly(input → span, correct answer 행 없음). */
            isSentence ? (
              <SentencePreviewTable
                items={sentencePageItems.map((item) => ({
                  id: item.id,
                  sentence: item.sentence,
                  answer: sentenceAnswers[item.id]?.answer ?? '',
                }))}
              />
            ) : (
              <VocabAnswerTable
                items={vocabPageItems}
                testType={testType}
                showSynonym={showSynonym}
                answers={vocabAnswers}
                onAnswerChange={() => {}}
                currentPage={currentPage}
                totalPages={totalPages}
                readOnly
              />
            )
          ) : isSentence ? (
            /* answer: 응시 중 — 입력 가능. */
            <SentenceAnswerTable
              items={sentencePageItems}
              answers={sentenceAnswers}
              onAnswerChange={handleSentenceChange}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          ) : (
            <VocabAnswerTable
              items={vocabPageItems}
              testType={testType}
              showSynonym={showSynonym}
              answers={vocabAnswers}
              onAnswerChange={handleVocabChange}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}

          <TestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <ProgressPanel
          questionIds={allIds}
          completedCount={completedIds.size}
          remainingCount={totalItems - completedIds.size}
          completedIds={completedIds}
          wrongIds={mode === 'review' ? wrongIds : undefined}
          mode={mode === 'review' ? 'review' : 'test'}
          onQuestionClick={setCurrentPage}
        />
      </div>

      {/* Task 19: 미제출 문항 확인 모달 */}
      {showSubmitConfirm && (
        <ConfirmDialog
          title="Unanswered Questions"
          description={`${totalItems - completedIds.size} question(s) are still unanswered.\nSubmit anyway?`}
          confirmLabel="Submit"
          cancelLabel="Go Back"
          onConfirm={doSubmit}
          onCancel={() => setShowSubmitConfirm(false)}
        />
      )}

      {/* Task 20: 제출 완료 모달 */}
      {showSubmitSuccess && (
        <AlertDialog
          variant="success"
          title="Submission Complete"
          description="Your answers have been submitted successfully."
          okLabel="OK"
          onClose={() => setShowSubmitSuccess(false)}
        />
      )}
    </div>
  );
}
