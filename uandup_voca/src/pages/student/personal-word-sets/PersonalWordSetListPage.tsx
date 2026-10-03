import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageTitle } from '@/shared/ui/PageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ConfirmDialog } from '@/shared/ui/Modal';
import { usePersonalWordSets, PersonalWordSetCard } from '@/entities/personal-word-set';
import type { PersonalWordSetRow } from '@/entities/personal-word-set';
import { useCurrentStudentId } from '@/entities/auth';
import { usePersonalWordSetActions, PersonalWordSetFormModal } from '@/features/personal-word';

// 학생의 개인 단어 세트 목록 — 사이드바 "Personal Words"의 목적지.
// 학부모는 라우트 가드에서 이미 차단되므로(서버도 403) 이 화면에서 읽기 전용 분기를 두지 않는다.
export default function PersonalWordSetListPage() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;

  const { data: sets = [], isLoading } = usePersonalWordSets(studentId, studentId > 0);
  const { remove } = usePersonalWordSetActions(studentId);

  // 'new' = 생성 모달, PersonalWordSetRow = 이름 변경 모달, null = 닫힘.
  const [formTarget, setFormTarget] = useState<PersonalWordSetRow | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonalWordSetRow | null>(null);

  function openSet(set: PersonalWordSetRow) {
    navigate({
      to: '/student/personal-words/$personalWordSetId',
      params: { personalWordSetId: String(set.id) },
    });
  }

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Personal Words" />
        <button
          onClick={() => setFormTarget('new')}
          className="bg-primary text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="font-bold">Add Word Set</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : sets.length === 0 ? (
        <EmptyState
          icon="auto_stories"
          title="No word sets yet."
          description="Create a set to start collecting words you want to memorize."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {sets.map((set) => (
            <PersonalWordSetCard
              key={set.id}
              set={set}
              onClick={() => openSet(set)}
              extraInfo={
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormTarget(set)}
                    className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Rename
                  </button>
                  <button
                    onClick={() => setDeleteTarget(set)}
                    className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}

      {formTarget !== null && (
        <PersonalWordSetFormModal
          studentId={studentId}
          target={formTarget === 'new' ? undefined : formTarget}
          onClose={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Word Set?"
          // 서버가 세트와 함께 소속 단어까지 소프트 삭제한다 — 그 사실을 사용자에게 알리는 유일한 지점이다.
          description={
            deleteTarget.wordCount > 0
              ? `"${deleteTarget.name}" and all ${deleteTarget.wordCount} word(s) in it will be removed.`
              : `"${deleteTarget.name}" will be removed.`
          }
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => remove.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
