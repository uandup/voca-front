import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { WordCard, DIFFICULTY_LEVELS } from '@/entities/word';
import type { WordCardData } from '@/entities/word';
import { useVocabularyBank } from './model/useVocabularyBank';
import { WordFormModal } from './ui/modals/WordFormModal';
import { DeleteWordModal } from './ui/modals/DeleteWordModal';

export default function VocabularyBankPage() {
  const [pendingKeyword, setPendingKeyword] = useState('');
  const [pendingLevel, setPendingLevel] = useState<number | ''>('');
  const [searchParams, setSearchParams] = useState({ keyword: '', level: '' as number | '' });
  const [page, setPage] = useState(0);

  const [editTarget, setEditTarget] = useState<WordCardData | null | 'new'>(null);
  const [deleteTarget, setDeleteTarget] = useState<WordCardData | null>(null);

  const { words, totalElements, totalPages } = useVocabularyBank(searchParams, page);

  function handleSearch() {
    setSearchParams({ keyword: pendingKeyword, level: pendingLevel });
    setPage(0);
  }

  function handleReset() {
    setPendingKeyword('');
    setPendingLevel('');
    setSearchParams({ keyword: '', level: '' });
    setPage(0);
  }

  return (
    <main>
      <header className="flex justify-between items-start mb-4">
        <PageTitle title="Vocabulary Bank" />
        <div className="flex gap-3">
          <button
            className="bg-linear-to-r bg-primary text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
            onClick={() => setEditTarget('new')}
          >
            <span className="material-symbols-outlined">add</span>
            <span className="font-bold">Add</span>
          </button>
        </div>
      </header>

      <section className="mb-4">
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/40 text-on-surface"
              placeholder="Search by word..."
              type="text"
              value={pendingKeyword}
              onChange={(e) => setPendingKeyword(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-auto items-center">
            <select
              className="bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/40 min-w-40"
              value={pendingLevel}
              onChange={(e) => setPendingLevel(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Level: All</option>
              {DIFFICULTY_LEVELS.map((l) => (
                <option key={l} value={l}>
                  Level {l}
                </option>
              ))}
            </select>
            <button
              className="bg-primary text-white px-4 py-3 rounded-lg font-bold hover:bg-primary/90 active:scale-95 transition-all"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="bg-surface-container-highest px-4 py-3 rounded-lg text-on-surface-variant font-bold hover:bg-primary/10 hover:text-primary active:scale-95 transition-all"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <p className="text-4xl font-bold text-primary my-6 ml-2">
        {totalElements}{' '}
        <span className="text-2xl font-bold text-primary/80">
          {totalElements === 1 ? 'word' : 'words'} found
        </span>
      </p>

      <div className="flex flex-col gap-8">
        {words.map((word) => (
          <WordCard
            key={word.id}
            {...word}
            showSentence
            extraInfo={
              // 카드 자체가 relative이므로 우상단 absolute 배치를 그대로 유지한다.
              <div className="absolute top-6 right-6 flex gap-2 z-10">
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-bold disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-on-surface-variant font-medium">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-bold disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {editTarget !== null && (
        <WordFormModal
          wordId={editTarget !== 'new' ? editTarget.id : undefined}
          initialData={editTarget !== 'new' ? editTarget : undefined}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteWordModal
          wordId={deleteTarget.id}
          word={deleteTarget.word}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
