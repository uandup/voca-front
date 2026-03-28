import { useState } from "react";
import { PageTitle } from "@/shared/ui/PageTitle";
import { VocabCard } from "./ui/VocabCard";
import { LevelStatCard } from "./ui/LevelStatCard";
import { VocabModal } from "./ui/modals/VocabModal";
import { UploadExcelModal } from "./ui/modals/UploadExcelModal";
import { mockVocabData } from "./mock/vocabMockData";

const levelStats = [
  { level: 1, count: 240 },
  { level: 2, count: 180 },
  { level: 3, count: 312 },
  { level: 4, count: 156 },
];

export default function VocabularyBankPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedLevel("");
  }

  return (
    <main>
      {/* Header Section */}
      <header className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <PageTitle title="Vocabulary Bank" />
          </div>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {levelStats.map((stat) => (
            <LevelStatCard
              key={stat.level}
              level={stat.level}
              count={stat.count}
            />
          ))}
        </div>

        {/* Filters & Search */}
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
          <div className="flex gap-3 w-auto">
            <select
              className="bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/40 min-w-40"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Difficulty: All</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
            </select>
            <button
              className="bg-surface-container-highest px-4 py-3 rounded-lg text-on-surface-variant font-bold hover:bg-primary/10 hover:text-primary active:scale-95 transition-all"
              onClick={handleResetFilters}
            >
              Init
            </button>
          </div>
        </div>
      </header>

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

      {/* Vocabulary List */}
      <div className="flex flex-col gap-8">
        {mockVocabData.map(({ id, ...vocabData }) => (
          <VocabCard key={id} {...vocabData} />
        ))}
      </div>
    </main>
  );
}
