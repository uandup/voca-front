import { VocabCard } from "./VocabCard";

const mockVocabData = [
  {
    id: 1,
    level: 3,
    levelColor: "primary" as const,
    word: "Ambiguity",
    synonyms: ["Vagueness", "Obscurity", "Equivocation"],
    partOfSpeech: "N",
    koreanMeaning: "모호함, 다의성",
    definition:
      "The quality of being open to more than one interpretation; inexactness.",
    example:
      "The ambiguity of the poem allows multiple readings by different critics.",
  },
  {
    id: 2,
    level: 4,
    levelColor: "tertiary" as const,
    word: "Corroborate",
    synonyms: ["Validate", "Verify", "Authenticate"],
    partOfSpeech: "V",
    koreanMeaning: "확증하다, 입증하다",
    definition:
      "To confirm or give support to (a statement, theory, or finding).",
    example:
      "The witness was able to corroborate the suspect's alibi with specific details.",
  },
  {
    id: 3,
    level: 2,
    levelColor: "primary" as const,
    word: "Resilient",
    synonyms: ["Tough", "Strong", "Adaptable"],
    partOfSpeech: "Adj",
    koreanMeaning: "회복력 있는, 탄력 있는",
    definition:
      "Able to withstand or recover quickly from difficult conditions.",
    example:
      "Despite the heavy rains, the local crops proved remarkably resilient.",
  },
];

export function VocabularyBankPage() {
  return (
    <main className="ml-64 pt-8 px-12 pb-24">
      {/* Header Section */}
      <header className="flex flex-col gap-8 mb-12">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-2">
              Vocabulary Bank
            </h1>
            <p className="text-on-surface-variant font-body">
              Manage and curate lexical sets for advanced academic English.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="border-2 border-primary text-primary px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary/5 active:scale-95 transition-all">
              <span className="material-symbols-outlined">file_upload</span>
              <span className="font-bold">Excel Upload</span>
            </button>
            <button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined">add</span>
              <span className="font-bold">Add New Word</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:border-primary/30 transition-colors group">
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">
              Level 1
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#002D8F]">
                240
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                words
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:border-primary/30 transition-colors group">
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">
              Level 2
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#002D8F]">
                180
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                words
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:border-primary/30 transition-colors group">
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">
              Level 3
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#002D8F]">
                312
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                words
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:border-primary/30 transition-colors group">
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">
              Level 4
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#002D8F]">
                156
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                words
              </span>
            </div>
          </div>
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
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select className="bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/40 min-w-[160px]">
              <option>Difficulty: All</option>
              <option>Level 1 (Basic)</option>
              <option>Level 2 (Intermediate)</option>
              <option>Level 3 (Advanced)</option>
              <option>Level 4 (Academic)</option>
            </select>
            <button className="bg-surface-container-highest p-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>
      </header>

      {/* Vocabulary List */}
      <div className="flex flex-col gap-8">
        {mockVocabData.map((item) => (
          <VocabCard key={item.id} {...item} />
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-primary shadow-xl rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all group">
          <span className="material-symbols-outlined text-3xl">add</span>
          <span className="absolute right-full mr-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Add Word
          </span>
        </button>
      </div>
    </main>
  );
}
