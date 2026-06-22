import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TableContainer } from '@/shared/ui/TableContainer';
import { NumberInput } from '@/shared/ui/NumberInput';
import { AlertDialog } from '@/shared/ui/Modal/AlertDialog';
import { LevelBlock, DIFFICULTY_LEVELS, useWordCountByLevel } from '@/entities/word';
import type { WordDifficultyLevel } from '@/entities/word';
import type { WordTestType } from '@/entities/test';
import type { LevelTestExamRow, LevelTestExamStatus } from '@/entities/level-test';
import { useLevelTestExamList } from '@/entities/level-test';
import { useLevelTestExamActions } from '@/features/level-test-exam';
import { useStudentOverview } from '@/entities/student';

interface Props {
  studentId: number;
}

interface LevelTestConfig {
  selectedLevel: WordDifficultyLevel;
  assignmentCount: string;
  questionCount: string;
  testType: WordTestType;
  includeSynonyms: boolean;
}

const COLUMNS = ['Date', 'Level', 'QTY', 'Score', 'Status', 'Actions'];
const TEST_TYPE_OPTIONS: WordTestType[] = ['meaning-to-word', 'word-to-meaning'];

// READY/IN_PROGRESS/SUBMITTED는 활성 — 동시 1개 제한 + Cancel 가능 + Grade 진입 가능.
// PASSED/FAILED는 종료 — View Results만.
const ACTIVE_STATUSES: LevelTestExamStatus[] = ['READY', 'IN_PROGRESS', 'SUBMITTED'];

function isActive(row: LevelTestExamRow): boolean {
  return ACTIVE_STATUSES.includes(row.status);
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function LevelTestTab({ studentId }: Props) {
  const navigate = useNavigate();

  const { data: student } = useStudentOverview(studentId);
  const { data: rows = [] } = useLevelTestExamList(studentId);

  const activeRow = rows.find(isActive) ?? null;
  const currentExamId = activeRow?.examId ?? null;

  const [config, setConfig] = useState<LevelTestConfig>({
    selectedLevel: 4,
    assignmentCount: '100',
    questionCount: '20',
    testType: 'meaning-to-word',
    includeSynonyms: true,
  });
  // student 로드 시 한 번만 학생 설정으로 초기화 — 이후엔 사용자 입력 보존.
  const [initialized, setInitialized] = useState(false);
  if (student && !initialized) {
    setConfig({
      selectedLevel: student.assignedLevel,
      assignmentCount: String(student.assignmentCount),
      questionCount: String(student.testQuestionCount),
      testType: student.testType,
      includeSynonyms: student.includeSynonyms,
    });
    setInitialized(true);
  }

  // 선택된 레벨의 전체 단어 수 — 레벨 변경 시 자동 재조회/캐싱.
  const { data: levelWordCount } = useWordCountByLevel(config.selectedLevel);

  const [showCreateSuccess, setShowCreateSuccess] = useState(false);

  const { create, startOnline, cancel } = useLevelTestExamActions({ studentId, currentExamId });

  const assignmentCountIsZero = Number(config.assignmentCount) === 0;
  const questionCountIsZero = Number(config.questionCount) === 0;
  const questionExceedsAssignment =
    !assignmentCountIsZero &&
    !questionCountIsZero &&
    Number(config.questionCount) > Number(config.assignmentCount);
  const generateDisabled =
    activeRow !== null ||
    assignmentCountIsZero ||
    questionCountIsZero ||
    questionExceedsAssignment ||
    create.isPending;

  function handleGenerate() {
    create.mutate(
      {
        level: config.selectedLevel,
        testType: config.testType,
        includeSynonyms: config.includeSynonyms,
        assignmentCount: Number(config.assignmentCount),
        questionCount: Number(config.questionCount),
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
      search: { returnTo: returnToCurrent(), examType: 'LEVEL_TEST' },
    });
  }

  function goReview(examId: number, studySetId: number) {
    navigate({
      to: '/teacher/exams/$examId/review',
      params: { examId: String(examId) },
      search: {
        returnTo: returnToCurrent(),
        studentId,
        studySetId,
        examType: 'LEVEL_TEST',
      },
    });
  }

  const inputClass =
    'w-full text-xs border border-primary/30 bg-white text-on-surface rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <div className="space-y-4">
      {/* Generator Card */}
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-4 border-b border-outline/20">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
            Select Level
          </p>
          <div className="flex gap-4">
            {DIFFICULTY_LEVELS.map((lv) => (
              <button
                key={lv}
                onClick={() => setConfig((prev) => ({ ...prev, selectedLevel: lv }))}
                className={`w-16 h-11 rounded-xl text-sm font-bold border-2 transition-all ${
                  config.selectedLevel === lv
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 bg-white text-on-surface-variant hover:border-primary/40'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>

        {/* Test Configuration Section — 항상 편집 가능, 학생 설정으로 초기화 */}
        <div className="px-8 py-5 flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <div className="grid grid-cols-5 gap-4 flex-1 max-w-3xl">
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Available Words
                </label>
                {/* 선택 레벨의 전체 단어 수 — 읽기 전용 (입력 불가) */}
                <div
                  className={`${inputClass} bg-surface-container-highest/40 text-on-surface-variant flex items-center`}
                >
                  {levelWordCount !== undefined && levelWordCount !== null ? levelWordCount : '—'}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Test Type
                </label>
                <select
                  value={config.testType}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, testType: e.target.value as WordTestType }))
                  }
                  className={inputClass}
                >
                  {TEST_TYPE_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Assignment Quantity
                </label>
                <NumberInput
                  value={config.assignmentCount}
                  onChange={(v) => setConfig((prev) => ({ ...prev, assignmentCount: v }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">
                  Question Quantity
                </label>
                <NumberInput
                  value={config.questionCount}
                  onChange={(v) => setConfig((prev) => ({ ...prev, questionCount: v }))}
                  className={inputClass}
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
              {/* Assignment / Question Quantity 유효성 검사 */}
              {!activeRow && assignmentCountIsZero && (
                <p className="text-xs text-error">Assignment Quantity must be at least 1.</p>
              )}
              {!activeRow && !assignmentCountIsZero && questionCountIsZero && (
                <p className="text-xs text-error">Question Quantity must be at least 1.</p>
              )}
              {!activeRow && questionExceedsAssignment && (
                <p className="text-xs text-error">
                  Question Quantity cannot exceed Assignment Quantity ({config.assignmentCount}).
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

      {/* History Table */}
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
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
                  // QTY 컬럼은 배정 단어 수(wordCount). Score 분모는 출제 문항 수(questionCount).
                  const scoreText =
                    row.correctCount !== null && row.totalCount !== null
                      ? `${row.correctCount}/${row.totalCount}`
                      : `- / ${row.questionCount}`;
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
                      <td className="px-4 py-4 border-r border-outline-variant/20">
                        <LevelBlock level={row.level} />
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
                                onClick={() => goReview(row.examId, row.studySetId)}
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
                              onClick={() => goReview(row.examId, row.studySetId)}
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

function StatusBadge({ status }: { status: LevelTestExamStatus }) {
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
