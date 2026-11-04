import { useNavigate } from '@tanstack/react-router';
import { TableContainer } from '@/shared/ui/TableContainer';
import { usePersonalTestExamList } from '@/entities/personal-test';
import type { PersonalTestExamRow, PersonalTestExamStatus } from '@/entities/personal-test';
import { usePersonalTestExamActions } from '@/features/personal-test-exam';

interface Props {
  studentId: number;
}

const COLUMNS = ['Date', 'Word Set', 'Range', 'QTY', 'Score', 'Status', 'Actions'];

// READY/IN_PROGRESS/SUBMITTED는 활성 — Cancel·Grade 진입 가능. PASSED/FAILED는 종료 — View Results만.
// 레벨·오답 뱅크 시험과 달리 동시 진행 제한이 없어 활성 행이 여러 개일 수 있다.
const ACTIVE_STATUSES: PersonalTestExamStatus[] = ['READY', 'IN_PROGRESS', 'SUBMITTED'];

function isActive(row: PersonalTestExamRow): boolean {
  return ACTIVE_STATUSES.includes(row.status);
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 클리닉 Personal Words 탭의 개인 단어장 시험 이력 — LevelTestTab의 이력 테이블과 같은 동작.
// 범위(#from–#to)는 생성 시점의 등록순 번호라, 이후 단어를 지우면 현재 세트 화면 번호와 다를 수 있다.
export function PersonalTestHistoryTable({ studentId }: Props) {
  const navigate = useNavigate();
  const { data: rows = [] } = usePersonalTestExamList(studentId);
  const { startOnline, cancel } = usePersonalTestExamActions(studentId);

  function returnToCurrent() {
    return window.location.pathname + window.location.search;
  }

  function goPreview(examId: number) {
    navigate({
      to: '/teacher/exams/$examId/preview',
      params: { examId: String(examId) },
      search: { returnTo: returnToCurrent(), examType: 'PERSONAL_TEST' },
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
        examType: 'PERSONAL_TEST',
      },
    });
  }

  return (
    <TableContainer>
      <div className="px-6 pt-5 pb-3 flex items-end gap-3">
        <h3 className="text-base font-headline font-bold text-primary">Personal Tests</h3>
        <p className="text-xs text-on-surface-variant mb-0.5">
          Wrong answers are added to the student's Review Deck.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            <col className="w-[11%]" />
            <col className="w-[19%]" />
            <col className="w-[10%]" />
            <col className="w-[7%]" />
            <col className="w-[9%]" />
            <col className="w-[10%]" />
            <col className="w-[34%]" />
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
                  No personal tests yet. Generate one from a word set.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const active = isActive(row);
                // QTY 컬럼은 범위 단어 수(wordCount). Score 분모는 출제 문항 수(questionCount).
                const scoreText =
                  row.correctCount !== null && row.totalCount !== null
                    ? `${row.correctCount}/${row.totalCount}`
                    : `- / ${row.questionCount}`;
                const scoreClass = active
                  ? 'text-on-surface-variant/40'
                  : row.status === 'PASSED'
                    ? 'text-success'
                    : 'text-error';
                const rangeText =
                  row.rangeStart !== null && row.rangeEnd !== null
                    ? `#${row.rangeStart}–#${row.rangeEnd}`
                    : '-';
                // 진행 중인 시작·취소 요청이 이 행의 것인지 — 동시에 여러 활성 행이 있을 수 있다
                const starting = startOnline.isPending && startOnline.variables === row.examId;
                const cancelling = cancel.isPending && cancel.variables === row.examId;

                return (
                  <tr key={row.examId}>
                    <td className="px-4 py-4 text-sm text-on-surface border-r border-outline-variant/20">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-on-surface border-r border-outline-variant/20">
                      <span className="truncate block">{row.personalWordSetName ?? '-'}</span>
                      {row.personalWordSetDeleted && (
                        <span className="text-[10px] font-semibold text-on-surface-variant/70">
                          Deleted set
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-on-surface-variant border-r border-outline-variant/20">
                      {rangeText}
                    </td>
                    <td className="px-4 py-4 text-sm text-on-surface-variant border-r border-outline-variant/20">
                      {row.wordCount}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold border-r border-outline-variant/20">
                      <span className={scoreClass}>{scoreText}</span>
                    </td>
                    <td className="px-4 py-4 border-r border-outline-variant/20">
                      <PersonalTestStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end flex-wrap">
                        {active ? (
                          <>
                            <button
                              onClick={() => goPreview(row.examId)}
                              className="px-4 py-1.5 border border-outline-variant/30 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => startOnline.mutate(row.examId)}
                              disabled={starting || row.status !== 'READY'}
                              className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {starting ? 'Starting...' : 'Start Online Test'}
                            </button>
                            <button
                              onClick={() => goReview(row.examId, row.studySetId)}
                              className="px-4 py-1.5 border border-primary/30 text-primary text-xs font-bold rounded-full hover:bg-primary/5 transition-colors"
                            >
                              Grade
                            </button>
                            <button
                              onClick={() => cancel.mutate(row.examId)}
                              disabled={cancelling}
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
  );
}

function PersonalTestStatusBadge({ status }: { status: PersonalTestExamStatus }) {
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
