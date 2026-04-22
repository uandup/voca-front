import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { VocabCard } from './ui/VocabCard';
import { VocabModal } from './ui/modals/VocabModal';
import { UploadExcelModal } from './ui/modals/UploadExcelModal';
import { mockVocabData } from './mock/vocabMockData';

export default function VocabularyBankPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  function handleResetFilters() {
    setSearchQuery('');
    setSelectedLevel('');
  }

  const filtered = mockVocabData.filter((v) => {
    const matchesSearch =
      searchQuery === '' ||
      v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.koreanMeaning.includes(searchQuery) ||
      v.synonyms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = selectedLevel === '' || v.difficultyLevel === Number(selectedLevel);
    return matchesSearch && matchesLevel;
  });

  return (
    <main>
      {/* Header Section */}
      <header className="flex justify-between items-start mb-4">
        <PageTitle title="Vocabulary Bank" />
        <div className="flex gap-3">
          <button
            className="border-2 border-primary text-primary px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary/5 active:scale-95 transition-all"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <span className="material-symbols-outlined">file_upload</span>
            <span className="font-bold">Excel Upload</span>
          </button>
          <button
            className="bg-linear-to-r from-primary to-primary-container text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined">add</span>
            <span className="font-bold">Add New Word</span>
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <section className="mb-4">
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/40 text-on-surface"
              placeholder="Search by word, meaning, or synonym..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-auto items-center">
            <select
              className="bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/40 min-w-40"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Level: All</option>
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map((l) => (
                <option key={l} value={l}>
                  Level {l}
                </option>
              ))}
            </select>
            <button
              className="bg-surface-container-highest px-4 py-3 rounded-lg text-on-surface-variant font-bold hover:bg-primary/10 hover:text-primary active:scale-95 transition-all"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {isUploadModalOpen && (
        <UploadExcelModal
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={(file) => {
            console.log(file);
            setIsUploadModalOpen(false);
          }}
        />
      )}

      {isModalOpen && (
        <VocabModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            console.log(data);
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Result count */}
      <p className="text-4xl font-bold text-primary my-6 ml-2">
        {filtered.length}{' '}
        <span className="text-2xl font-bold text-primary/80">
          {filtered.length === 1 ? 'word' : 'words'} found
        </span>
      </p>

      {/* Vocabulary List */}
      <div className="flex flex-col gap-8">
        {filtered.map(({ id, ...vocabData }) => (
          <VocabCard key={id} {...vocabData} />
        ))}
      </div>
    </main>
  );
}
