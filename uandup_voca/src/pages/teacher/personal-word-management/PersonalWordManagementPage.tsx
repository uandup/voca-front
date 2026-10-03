import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ConfirmDialog } from '@/shared/ui/Modal';
import { usePersonalWordsBySet, PersonalWordCard } from '@/entities/personal-word';
import type { PersonalWordCardData } from '@/entities/personal-word';
import { usePersonalWordSets } from '@/entities/personal-word-set';
import { useStudentOverview } from '@/entities/student';
import {
  usePersonalWordActions,
  PersonalWordBulkAddModal,
  PersonalWordEditModal,
} from '@/features/personal-word';

// 한 세트의 개인 단어를 등록/수정/삭제하는 선생님 전용 페이지 — VocabularyBankPage와 구조는
// 같지만, PersonalWord는 word/koreanMeaning 2필드뿐이고 목록 조회가 검색/페이지네이션을
// 지원하지 않아(세트 단위로 전체를 한번에 반환) 서버 검색 대신 클라이언트 필터링만 쓴다.
export default function PersonalWordManagementPage() {
  const { studentId: studentIdParam, personalWordSetId: setIdParam } = useParams({
    from: '/teacher/clinics_/students/$studentId_/personal-words/$personalWordSetId',
  });
  const studentId = Number(studentIdParam);
  const personalWordSetId = Number(setIdParam);
  const navigate = useNavigate();

  const { data: student } = useStudentOverview(studentId);
  const { data: words = [], isLoading } = usePersonalWordsBySet(
    personalWordSetId,
    personalWordSetId > 0,
  );
  // 세트 이름은 목록 캐시에서 찾는다 — 세트 단건 조회 API를 따로 두지 않는다.
  const { data: sets = [] } = usePersonalWordSets(studentId, studentId > 0);
  const setName = sets.find((s) => s.id === personalWordSetId)?.name ?? '...';

  const { remove } = usePersonalWordActions({ studentId, personalWordSetId });

  const [keyword, setKeyword] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<PersonalWordCardData | null>(null);
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
          title={setName}
        />
        <button
          className="bg-linear-to-r bg-primary text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
          onClick={() => setShowBulkAdd(true)}
        >
          <span className="material-symbols-outlined">add</span>
          <span className="font-bold">Add Words</span>
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
        <EmptyState
          title={words.length === 0 ? 'No words in this set yet.' : 'No matching words.'}
          description={
            words.length === 0
              ? 'Paste two columns from Excel to add many words at once.'
              : undefined
          }
        />
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

      {showBulkAdd && (
        <PersonalWordBulkAddModal
          studentId={studentId}
          personalWordSetId={personalWordSetId}
          onClose={() => setShowBulkAdd(false)}
        />
      )}

      {editTarget && (
        <PersonalWordEditModal
          studentId={studentId}
          personalWordSetId={personalWordSetId}
          word={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Word?"
          description={`Remove "${deleteTarget.word}" from this set. This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() =>
            remove.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
          }
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
