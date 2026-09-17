import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TableContainer } from '@/shared/ui/TableContainer';
import { AlertDialog } from '@/shared/ui/Modal';
import type { WordTestType } from '@/entities/test';
import { usePersonalWords } from '@/entities/personal-word';
import { usePersonalExamList } from '@/entities/personal-exam';
import type { PersonalExamRow, PersonalExamStatus } from '@/entities/personal-exam';
import { usePersonalExamActions } from '@/features/personal-exam';

interface Props {
  studentId: number;
}

const COLUMNS = ['QTY', 'Score', 'Status', 'Actions'];
const TEST_TYPE_OPTIONS: WordTestType[] = ['meaning-to-word', 'word-to-meaning'];

// READY/SUBMITTED가 활성 — 동시 1개 제한 + Cancel 가능 + Grade 진입 가능.
// PersonalExam은 ONLINE_STARTED 단계가 없어(생성 즉시 응시 가능) ReviewDeck의 IN_PROGRESS가 없다.
const ACTIVE_STATUSES: PersonalExamStatus[] = ['READY', 'SUBMITTED'];

function isActive(row: PersonalExamRow): boolean {
  return ACTIVE_STATUSES.includes(row.status);
}

// 학생의 개인 단어(등록순) 목록에서 시험 범위를 고르는 탭 — 클리닉 상세의 4번째 탭.
// ReviewDeck(WrongWordBankTab)과 구조는 같지만, 시험 생성이 "수량"이 아니라 "등록순 연속 구간
// (startIndex~endIndex)" 기반이라 별도의 From/To 선택 UI가 필요하다. 선생님이 인덱스를 직접
// 입력하게 하면 단어 삭제로 순번이 밀린 뒤 엉뚱한 범위가 만들어질 수 있어, 항상 최신 단어
// 목록에서 즉석으로 만든 옵션만 고르게 한다(값을 저장/기억하지 않음).
export function PersonalWordBankTab({ studentId }: Props) {
  const navigate = useNavigate();

  const { data: words = [] } = usePersonalWords(studentId);
  const { data: rows = [] } = usePersonalExamList(studentId);

  const activeRow = rows.find(isActive) ?? null;
  const currentPersonalExamId = activeRow?.personalExamId ?? null;

  const [testType, setTestType] = useState<WordTestType>('word-to-meaning');
  const [fromIndex, setFromIndex] = useState<number | null>(null);
  const [toIndex, setToIndex] = useState<number | null>(null);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);

  const { create, cancel } = usePersonalExamActions({ studentId, currentPersonalExamId });

  // From/To 옵션은 매 렌더마다 현재 words에서 즉석으로 만든다 — 저장된 인덱스를 절대 신뢰하지 않고,
  // 화면에 보이는 단어와 항상 1:1로 대응시킨다. 단어가 삭제되면 다음 렌더에서 옵션이 자동으로
  // 줄어들어 stale 상태가 있을 수 없다.
  const wordOptions = words.map((w, i) => ({
    index: i + 1,
    label: `${i + 1}. ${w.word} — ${w.koreanMeaning}`,
  }));

  const effectiveFrom = fromIndex !== null && fromIndex <= words.length ? fromIndex : 1;
  const effectiveTo =
    toIndex !== null && toIndex <= words.length && toIndex >= effectiveFrom
      ? toIndex
      : words.length;

  const toOptions = wordOptions.filter((o) => o.index >= effectiveFrom);

  const generateDisabled = activeRow !== null || words.length === 0 || create.isPending;

  function handleGenerate() {
    create.mutate(
      { startIndex: effectiveFrom, endIndex: effectiveTo, testType },
      { onSuccess: () => setShowCreateSuccess(true) },
    );
  }

  function returnToCurrent() {
    return window.location.pathname + window.location.search;
  }

  function goPreview(personalExamId: number) {
    navigate({
      to: '/teacher/exams/$examId/preview',
      params: { examId: String(personalExamId) },
      search: { returnTo: returnToCurrent(), examType: 'PERSONAL' },
    });
  }

  function goReview(personalExamId: number) {
    navigate({
      to: '/teacher/exams/$examId/review',
      params: { examId: String(personalExamId) },
      search: { returnTo: returnToCurrent(), studentId, examType: 'PERSONAL' },
    });
  }

  function goManageWords() {
    navigate({
      to: '/teacher/clinics/students/$studentId/personal-words',
      params: { studentId: String(studentId) },
    });
  }

  return (
    <div className="space-y-4">
      {/* Personal Word Bank card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-4 border-b border-outline/20 flex items-center justify-between">
          <div className="flex items-end gap-3">
            <h3 className="text-xl font-headline font-bold text-primary">Personal Word Bank</h3>
            <p className="text-xs text-on-surface-variant mb-0.5">
              {words.length} {words.length === 1 ? 'word' : 'words'} registered
            </p>
          </div>
          <button
            onClick={goManageWords}
            className="flex items-center rounded-lg gap-0.5 px-3 py-2.5 text-xs shadow-lg shadow-primary/10 font-bold bg-primary hover:opacity-90 transition-opacity text-white"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              edit_note
            </span>
            Manage Word List
          </button>
        </div>

        {/* Test Configuration Section — From/To 드롭다운으로 연속 구간 선택 */}
        <div className="px-8 py-5 flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <div className="grid grid-cols-3 gap-4 flex-1 max-w-2xl">
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Test Type
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as WordTestType)}
                  className="w-full text-xs border border-primary/30 bg-white text-on-surface rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {TEST_TYPE_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  From
                </label>
                <select
                  value={effectiveFrom}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setFromIndex(next);
                    // From이 To보다 뒤로 가면 To도 함께 리셋 — toOptions가 즉시 재계산되어
                    // 역순 조합이 렌더에 노출될 일이 없다.
                    if (toIndex !== null && toIndex < next) setToIndex(null);
                  }}
                  disabled={words.length === 0}
                  className="w-full text-xs border border-primary/30 bg-white text-on-surface rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  {wordOptions.map((o) => (
                    <option key={o.index} value={o.index}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  To
                </label>
                <select
                  value={effectiveTo}
                  onChange={(e) => setToIndex(Number(e.target.value))}
                  disabled={words.length === 0}
                  className="w-full text-xs border border-primary/30 bg-white text-on-surface rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  {toOptions.map((o) => (
                    <option key={o.index} value={o.index}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {activeRow && (
                <p className="text-xs text-error">
                  An active test exists. Cancel or finish it before generating.
                </p>
              )}
              {!activeRow && words.length === 0 && (
                <p className="text-xs text-on-surface-variant">
                  No words to test yet. Add words first.
                </p>
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

      {/* Personal Exam Test History Table */}
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[50%]" />
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
                  const scoreText =
                    row.correctCount !== null ? `${row.correctCount}/${row.totalCount}` : '--';
                  const scoreClass = active
                    ? 'text-on-surface-variant/40'
                    : row.isPassed
                      ? 'text-success'
                      : 'text-error';

                  return (
                    <tr key={row.personalExamId}>
                      <td className="px-4 py-4 text-sm text-on-surface-variant border-r border-outline-variant/20">
                        {row.totalCount}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold border-r border-outline-variant/20">
                        <span className={scoreClass}>{scoreText}</span>
                      </td>
                      <td className="px-4 py-4 border-r border-outline-variant/20">
                        <StatusBadge status={row.status} isPassed={row.isPassed} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          {active ? (
                            <>
                              <button
                                onClick={() => goPreview(row.personalExamId)}
                                className="px-4 py-1.5 border border-outline-variant/30 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => goReview(row.personalExamId)}
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
                          ) : row.status === 'COMPLETED' ? (
                            <button
                              onClick={() => goReview(row.personalExamId)}
                              className="px-4 py-1.5 border border-slate-200 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 transition-colors"
                            >
                              View Results
                            </button>
                          ) : (
                            // CANCELLED — 서버 정책상 조회·채점이 불가한 시험이라 액션을 두지 않는다.
                            <span className="text-xs text-on-surface-variant/40">—</span>
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

      {showCreateSuccess && (
        <AlertDialog
          variant="success"
          title="Test Generated!"
          description="The test has been successfully created."
          onClose={() => setShowCreateSuccess(false)}
        />
      )}
    </div>
  );
}

function StatusBadge({
  status,
  isPassed,
}: {
  status: PersonalExamStatus;
  isPassed: boolean | null;
}) {
  switch (status) {
    case 'READY':
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
    case 'COMPLETED':
      return isPassed ? (
        <span className="px-3 py-1 bg-success/5 border border-success/20 rounded-full text-[10px] font-bold text-success uppercase tracking-wide">
          Passed
        </span>
      ) : (
        <span className="px-3 py-1 bg-error/5 border border-error/20 rounded-full text-[10px] font-bold text-error uppercase tracking-wide">
          Failed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          Cancelled
        </span>
      );
  }
}
