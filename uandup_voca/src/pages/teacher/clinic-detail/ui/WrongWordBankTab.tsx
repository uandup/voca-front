import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TableContainer } from '@/shared/ui/TableContainer';
import { NumberInput } from '@/shared/ui/NumberInput';
import { SuccessModal } from '@/shared/ui/SuccessModal';
import type { WordTestType } from '@/entities/test';
import { ReviewDeckWordsModal } from '@/entities/review-deck';
import type { ReviewDeckExamRow, ReviewDeckExamStatus } from '@/entities/review-deck';
import {
  useReviewDeckExamList,
  useReviewDeckCount,
  useReviewDeckWords,
  useReviewDeckExamActions,
} from '@/features/review-deck-exam';
import { useStudentOverview } from '../model/hooks/useStudentOverview';

interface Props {
  studentId: number;
}

interface ReviewDeckConfig {
  qty: string;
  testType: WordTestType;
  includeSynonyms: boolean;
}

const COLUMNS = ['Date', 'QTY', 'Score', 'Status', 'Actions'];
const TEST_TYPE_OPTIONS: WordTestType[] = ['meaning-to-word', 'word-to-meaning'];

// READY/IN_PROGRESS/SUBMITTED는 활성 — 동시 1개 제한 + Cancel 가능 + Grade 진입 가능.
// PASSED/FAILED는 종료 — View Results만.
const ACTIVE_STATUSES: ReviewDeckExamStatus[] = ['READY', 'IN_PROGRESS', 'SUBMITTED'];

function isActive(row: ReviewDeckExamRow): boolean {
  return ACTIVE_STATUSES.includes(row.status);
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function WrongWordBankTab({ studentId }: Props) {
  const navigate = useNavigate();

  const { data: student } = useStudentOverview(studentId);
  const { data: count = 0 } = useReviewDeckCount(studentId);
  const { data: rows = [] } = useReviewDeckExamList(studentId);

  // 활성 시험 — 동시 1개만 허용. Generate 버튼 disable 판단 + currentExamId 추출.
  const activeRow = rows.find(isActive) ?? null;
  const currentExamId = activeRow?.examId ?? null;

  const [config, setConfig] = useState<ReviewDeckConfig>({
    qty: '10',
    testType: 'meaning-to-word',
    includeSynonyms: true,
  });
  // student 로드 시 한 번만 학생 설정으로 초기화 — 이후엔 사용자 입력을 보존.
  const [initialized, setInitialized] = useState(false);
  if (student && !initialized) {
    setConfig({
      qty: String(student.testQuestionCount),
      testType: student.testType,
      includeSynonyms: student.includeSynonyms,
    });
    setInitialized(true);
  }

  const [showWords, setShowWords] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const { data: words = [], isLoading: wordsLoading } = useReviewDeckWords(studentId, showWords);

  const { create, startOnline, cancel } = useReviewDeckExamActions({ studentId, currentExamId });

  const generateDisabled = activeRow !== null || count === 0 || create.isPending;

  function handleGenerate() {
    create.mutate(
      {
        qty: Number(config.qty),
        testType: config.testType,
        includeSynonyms: config.includeSynonyms,
      },
      { onSuccess: () => setShowCreateSuccess(true) },
    );
  }

  function returnToCurrent() {
    return window.location.pathname + window.location.search;
  }

  function goPreview(examId: number) {
    navigate({
      to: '/teacher/exams/$examId/preview',
      params: { examId: String(examId) },
      search: { returnTo: returnToCurrent(), examType: 'REVIEW_DECK' },
    });
  }

  function goReview(examId: number) {
    navigate({
      to: '/teacher/exams/$examId/review',
      params: { examId: String(examId) },
      // studySetId는 wrong-bank invalidation에선 사용되지 않지만 search 스키마 호환을 위해 함께 전달.
      search: {
        returnTo: returnToCurrent(),
        studentId,
        studySetId: activeRow?.studySetId ?? rows[0]?.studySetId ?? 0,
        examType: 'REVIEW_DECK',
      },
    });
  }

  return (
    <div className="space-y-4">
      {/* Review Deck Database card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-4 border-b border-outline/20 flex items-center justify-between">
          <div className="flex items-end gap-3">
            <h3 className="text-xl font-headline font-bold text-primary">Review Deck Database</h3>
            <p className="text-xs text-on-surface-variant mb-0.5">
              Total {count} incorrect {count === 1 ? 'word' : 'words'} tracked
            </p>
          </div>
          <button
            onClick={() => setShowWords(true)}
            className="flex items-center rounded-lg gap-0.5 px-3 py-2.5 text-xs shadow-lg shadow-primary/10 font-bold bg-primary hover:opacity-90 transition-opacity text-white"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              open_in_new
            </span>
            View Word List
          </button>
        </div>

        {/* Test Configuration Section — 항상 편집 가능. 학생 설정으로 초기화. */}
        <div className="px-8 py-5 flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <div className="grid grid-cols-3 gap-4 flex-1 max-w-lg">
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Test Type
                </label>
                <select
                  value={config.testType}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, testType: e.target.value as WordTestType }))
                  }
                  className="w-full text-xs border border-primary/30 bg-white text-on-surface rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {TEST_TYPE_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Quantity
                </label>
                <NumberInput
                  value={config.qty}
                  onChange={(v) => setConfig((prev) => ({ ...prev, qty: v }))}
                  className="w-full text-xs border border-primary/30 bg-white text-on-surface rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Include Synonyms
                </label>
                <label className="relative inline-flex items-center mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeSynonyms}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, includeSynonyms: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-8 h-5 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {activeRow && (
                <p className="text-xs text-error">
                  An active test exists. Cancel or finish it before generating.
                </p>
              )}
              {!activeRow && count === 0 && (
                <p className="text-xs text-on-surface-variant">No incorrect words to test yet.</p>
              )}
              <button
                onClick={handleGenerate}
                disabled={generateDisabled}
                className="flex items-center gap-2 bg-primary hover:opacity-90 transition-opacity text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-lg shadow-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {create.isPending ? 'Generating...' : 'Generate Test'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Deck Test History Table */}
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[44%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-container-highest/30">
                {COLUMNS.map((col, i) => (
                  <th
                    key={col}
                    className={`px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest ${i < COLUMNS.length - 1 ? 'border-r border-outline-variant/20' : ''} ${col === 'Actions' ? 'text-right' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-12 text-center text-sm text-on-surface-variant"
                  >
                    No tests yet. Generate one to start.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const active = isActive(row);
                  // 채점 완료(PASSED/FAILED) 행은 correctCount/totalCount 표시 — color는 status로.
                  const scoreText =
                    row.correctCount !== null && row.totalCount !== null
                      ? `${row.correctCount}/${row.totalCount}`
                      : '--';
                  const scoreClass = active
                    ? 'text-on-surface-variant/40'
                    : row.status === 'PASSED'
                      ? 'text-success'
                      : 'text-error';

                  return (
                    <tr key={row.examId}>
                      <td className="px-4 py-4 text-sm text-on-surface border-r border-outline-variant/20">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-sm text-on-surface-variant border-r border-outline-variant/20">
                        {row.wordCount}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold border-r border-outline-variant/20">
                        <span className={scoreClass}>{scoreText}</span>
                      </td>
                      <td className="px-4 py-4 border-r border-outline-variant/20">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          {active ? (
                            <>
                              <button
                                onClick={() => goPreview(row.examId)}
                                className="px-4 py-1.5 border border-outline-variant/30 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => startOnline.mutate()}
                                disabled={startOnline.isPending || row.status !== 'READY'}
                                className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {startOnline.isPending ? 'Starting...' : 'Start Online Test'}
                              </button>
                              <button
                                onClick={() => goReview(row.examId)}
                                className="px-4 py-1.5 border border-primary/30 text-primary text-xs font-bold rounded-full hover:bg-primary/5 transition-colors"
                              >
                                Grade
                              </button>
                              <button
                                onClick={() => cancel.mutate()}
                                disabled={cancel.isPending}
                                className="px-4 py-1.5 border border-error/30 text-error text-xs font-bold rounded-full hover:bg-error/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => goReview(row.examId)}
                              className="px-4 py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors"
                            >
                              View Results
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </TableContainer>

      {showWords && (
        <ReviewDeckWordsModal
          words={words}
          isLoading={wordsLoading}
          onClose={() => setShowWords(false)}
        />
      )}

      {showCreateSuccess && (
        <SuccessModal
          message="Test Generated!"
          description="The test has been successfully created."
          onClose={() => setShowCreateSuccess(false)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewDeckExamStatus }) {
  switch (status) {
    case 'READY':
    case 'IN_PROGRESS':
      return (
        <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-wide">
          Pending
        </span>
      );
    case 'SUBMITTED':
      return (
        <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-bold text-blue-500 uppercase tracking-wide">
          Awaiting
        </span>
      );
    case 'PASSED':
      return (
        <span className="px-3 py-1 bg-success/5 border border-success/20 rounded-full text-[10px] font-bold text-success uppercase tracking-wide">
          Passed
        </span>
      );
    case 'FAILED':
      return (
        <span className="px-3 py-1 bg-error/5 border border-error/20 rounded-full text-[10px] font-bold text-error uppercase tracking-wide">
          Failed
        </span>
      );
  }
}
