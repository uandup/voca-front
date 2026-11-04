import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TableContainer } from '@/shared/ui/TableContainer';
import { ConfirmDialog, AlertDialog } from '@/shared/ui/Modal';
import { usePersonalWordSets } from '@/entities/personal-word-set';
import type { PersonalWordSetRow } from '@/entities/personal-word-set';
import { usePersonalWordSetActions, PersonalWordSetFormModal } from '@/features/personal-word';
import { PersonalTestCreateModal } from '@/features/personal-test-exam';
import { PersonalTestHistoryTable } from './PersonalTestHistoryTable';

interface Props {
  studentId: number;
}

const COLUMNS = ['Set Name', 'Added By', 'Words', 'Actions'];

// 학생의 개인 단어 세트를 관리하는 탭 — 클리닉 상세의 4번째 탭.
//
// 과거엔 이 탭이 개인 단어 시험을 만드는 화면이었고, 출제가 "등록순 연속 구간(startIndex~endIndex)"
// 기반이라 From/To 선택 UI를 따로 두고 있었다. 개인 단어장이 암기 전용이 되면서(시험 기능 제거)
// 그 인덱스 UI와 이력 테이블이 전부 사라졌다 — 단어 순번이 시험 범위의 기준이 아니게 되어
// "단어를 지우면 순번이 밀린다"는 취약점도 함께 없어졌다.
// 지금은 ReviewDeck(WrongWordBankTab)·LevelTest 탭과 달리 시험 개념이 없는 순수 관리 테이블이다.
//
// (2026-11) 개인 단어장 시험이 다시 생겼다 — 이번엔 별도 테이블이 아니라 공용 시험 파이프라인(PERSONAL 타입)을
// 타서, 채점 큐·채점 화면·학생 응시 화면을 그대로 쓰고 오답이 리뷰덱에 들어간다.
// 출제는 다시 "등록순 연속 구간 + 문항 수"지만, 위 취약점(번호 밀림)은 생성 요청에 양끝 단어 id를 함께 보내
// 서버가 409로 막는다(PersonalTestCreateModal). 문항엔 출제 시점 단어·뜻이 스냅샷으로 남아 이후 수정에도 기록이 고정된다.
// 시험 이력은 세트 테이블 아래 PersonalTestHistoryTable.
export function PersonalWordBankTab({ studentId }: Props) {
  const navigate = useNavigate();

  const { data: sets = [] } = usePersonalWordSets(studentId, studentId > 0);
  const { remove } = usePersonalWordSetActions(studentId);

  // 'new' = 생성 모달, PersonalWordSetRow = 이름 변경 모달, null = 닫힘.
  const [formTarget, setFormTarget] = useState<PersonalWordSetRow | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonalWordSetRow | null>(null);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  // 단어가 하나라도 있는 세트가 있어야 범위를 고를 수 있다
  const hasTestableSet = sets.some((set) => set.wordCount > 0);

  const totalWords = sets.reduce((sum, set) => sum + set.wordCount, 0);

  function goManageWords(set: PersonalWordSetRow) {
    navigate({
      to: '/teacher/clinics/students/$studentId/personal-words/$personalWordSetId',
      params: { studentId: String(studentId), personalWordSetId: String(set.id) },
    });
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-outline/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-4 border-b border-outline/20 flex items-center justify-between">
          <div className="flex items-end gap-3">
            <h3 className="text-xl font-headline font-bold text-primary">Personal Word Sets</h3>
            <p className="text-xs text-on-surface-variant mb-0.5">
              {sets.length} {sets.length === 1 ? 'set' : 'sets'} · {totalWords}{' '}
              {totalWords === 1 ? 'word' : 'words'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateTest(true)}
              disabled={!hasTestableSet}
              className="flex items-center rounded-lg gap-0.5 px-3 py-2.5 text-xs font-bold border border-primary/30 text-primary hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                quiz
              </span>
              Generate Test
            </button>
            <button
              onClick={() => setFormTarget('new')}
              className="flex items-center rounded-lg gap-0.5 px-3 py-2.5 text-xs shadow-lg shadow-primary/10 font-bold bg-primary hover:opacity-90 transition-opacity text-white"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                add
              </span>
              Add Word Set
            </button>
          </div>
        </div>

        <div className="px-8 py-4">
          <p className="text-xs text-on-surface-variant">
            Students can add their own sets and words too. Generate a test from a range of a set —
            results are saved and wrong answers go to the Review Deck.
          </p>
        </div>
      </div>

      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[35%]" />
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
              {sets.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-12 text-center text-sm text-on-surface-variant"
                  >
                    No word sets yet. Add one to start collecting words.
                  </td>
                </tr>
              ) : (
                sets.map((set) => (
                  <tr key={set.id}>
                    <td className="px-4 py-4 text-sm font-bold text-on-surface border-r border-outline-variant/20 truncate">
                      {set.name}
                    </td>
                    <td className="px-4 py-4 border-r border-outline-variant/20">
                      <CreatorBadge role={set.createdByRole} />
                    </td>
                    <td className="px-4 py-4 text-sm text-on-surface-variant border-r border-outline-variant/20">
                      {set.wordCount}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => goManageWords(set)}
                          className="px-4 py-1.5 border border-primary/30 text-primary text-xs font-bold rounded-full hover:bg-primary/5 transition-colors"
                        >
                          Manage Words
                        </button>
                        <button
                          onClick={() => setFormTarget(set)}
                          className="px-4 py-1.5 border border-outline-variant/30 text-on-surface-variant text-xs font-bold rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => setDeleteTarget(set)}
                          className="px-4 py-1.5 border border-error/30 text-error text-xs font-bold rounded-full hover:bg-error/5 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TableContainer>

      <PersonalTestHistoryTable studentId={studentId} />

      {formTarget !== null && (
        <PersonalWordSetFormModal
          studentId={studentId}
          target={formTarget === 'new' ? undefined : formTarget}
          onClose={() => setFormTarget(null)}
        />
      )}

      {showCreateTest && (
        <PersonalTestCreateModal
          studentId={studentId}
          onClose={() => setShowCreateTest(false)}
          onCreated={() => setShowCreateSuccess(true)}
        />
      )}

      {showCreateSuccess && (
        <AlertDialog
          variant="success"
          title="Test Generated!"
          description="The test has been created. Press Start Online Test when the student is ready."
          onClose={() => setShowCreateSuccess(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Word Set?"
          // 서버가 세트와 함께 소속 단어까지 소프트 삭제한다.
          description={
            deleteTarget.wordCount > 0
              ? `"${deleteTarget.name}" and all ${deleteTarget.wordCount} word(s) in it will be removed.`
              : `"${deleteTarget.name}" will be removed.`
          }
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() =>
            remove.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
          }
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function CreatorBadge({ role }: { role: PersonalWordSetRow['createdByRole'] }) {
  return role === 'STUDENT' ? (
    <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-bold text-blue-500 uppercase tracking-wide">
      Student
    </span>
  ) : (
    <span className="px-3 py-1 bg-surface-container-highest border border-outline-variant/40 rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
      Teacher
    </span>
  );
}
