import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ConfirmDialog } from '@/shared/ui/Modal';
import { usePersonalWords, PersonalWordCard } from '@/entities/personal-word';
import type { PersonalWordCardData } from '@/entities/personal-word';
import { useStudentOverview } from '@/entities/student';
import { usePersonalWordActions } from './model/usePersonalWordActions';
import { PersonalWordFormModal } from './ui/modals/PersonalWordFormModal';

// 개인 단어 등록/수정/삭제 전용 페이지 — VocabularyBankPage와 구조는 같지만, PersonalWord는
// word/koreanMeaning 2필드뿐이고 getPersonalWords가 검색/페이지네이션을 지원하지 않아
// (학생당 목록 전체를 한번에 반환) 서버 검색 대신 클라이언트 필터링만 쓴다.
export default function PersonalWordManagementPage() {
  const { studentId: studentIdParam } = useParams({
    from: '/teacher/clinics_/students/$studentId_/personal-words',
  });
  const studentId = Number(studentIdParam);
  const navigate = useNavigate();

  const { data: student } = useStudentOverview(studentId);
  const { data: words = [], isLoading } = usePersonalWords(studentId);
  const { remove } = usePersonalWordActions(studentId);

  const [keyword, setKeyword] = useState('');
  const [editTarget, setEditTarget] = useState<PersonalWordCardData | null | 'new'>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonalWordCardData | null>(null);

  const filteredWords = keyword.trim()
    ? words.filter((w) => {
        const q = keyword.trim().toLowerCase();
        return w.word.toLowerCase().includes(q) || w.koreanMeaning.toLowerCase().includes(q);
      })
    : words;

  function goBackToTab() {
    navigate({
      to: '/teacher/clinics/students/$studentId',
      params: { studentId: String(studentId) },
      search: { tab: 'personalWords' },
    });
  }

  return (
    <main>
      <header className="flex justify-between items-start mb-4">
        <BreadcrumbPageTitle
          parents={[
            { label: 'Clinics', onClick: () => navigate({ to: '/teacher/clinics' }) },
            { label: student?.nameKo ?? '...', onClick: goBackToTab },
          ]}
          title="Personal Word List"
        />
        <button
          className="bg-linear-to-r bg-primary text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
          onClick={() => setEditTarget('new')}
        >
          <span className="material-symbols-outlined">add</span>
          <span className="font-bold">Add</span>
        </button>
      </header>

      <section className="mb-4">
        <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/40 text-on-surface"
              placeholder="Search by word or meaning..."
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      </section>

      <p className="text-4xl font-bold text-primary my-6 ml-2">
        {filteredWords.length}{' '}
        <span className="text-2xl font-bold text-primary/80">
          {filteredWords.length === 1 ? 'word' : 'words'} found
        </span>
      </p>

      {isLoading ? (
        <LoadingSpinner />
      ) : filteredWords.length === 0 ? (
        <EmptyState title={words.length === 0 ? 'No words yet.' : 'No matching words.'} />
      ) : (
        <div className="flex flex-col gap-5">
          {filteredWords.map((word) => (
            <PersonalWordCard
              key={word.id}
              {...word}
              extraInfo={
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTarget(word)}
                    className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(word)}
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

      {editTarget !== null && (
        <PersonalWordFormModal
          studentId={studentId}
          wordId={editTarget !== 'new' ? editTarget.id : undefined}
          initialData={editTarget !== 'new' ? editTarget : undefined}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Word?"
          description={`Remove "${deleteTarget.word}" from this student's personal word list. This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => remove.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
