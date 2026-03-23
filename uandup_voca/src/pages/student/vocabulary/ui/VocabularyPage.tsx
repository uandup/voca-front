interface VocabWord {
  id: number;
  level: number;
  category: string;
  word: string;
  partOfSpeech: string;
  koreanMeaning: string;
  synonyms: string[];
  starred: boolean;
}

const mockWords: VocabWord[] = [
  {
    id: 1,
    level: 3,
    category: "Academic Core",
    word: "Ambiguity",
    partOfSpeech: "Noun",
    koreanMeaning: "모호함, 다의성",
    synonyms: ["vague", "obscurity", "uncertainty"],
    starred: true,
  },
  {
    id: 2,
    level: 4,
    category: "Scholarly Prose",
    word: "Juxtaposition",
    partOfSpeech: "Noun",
    koreanMeaning: "병치, 나란히 놓기",
    synonyms: ["comparison", "proximity", "adjacency"],
    starred: false,
  },
  {
    id: 3,
    level: 3,
    category: "Literature Analysis",
    word: "Inherent",
    partOfSpeech: "Adjective",
    koreanMeaning: "내재하는, 본질적인",
    synonyms: ["intrinsic", "innate", "essential"],
    starred: true,
  },
  {
    id: 4,
    level: 5,
    category: "Advanced Dialectic",
    word: "Pragmatic",
    partOfSpeech: "Adjective",
    koreanMeaning: "실용적인, 실제적인",
    synonyms: ["practical", "utilitarian", "sensible"],
    starred: false,
  },
];

export function VocabularyPage() {
  return (
    <main>
      {/* Page Title */}
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight">
          Vocabulary
        </h1>
      </div>

      {/* Word List */}
      <div className="space-y-6">
        {mockWords.map((word) => (
          <div
            key={word.id}
            className="group relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 transition-all hover:-translate-y-0.5 hover:shadow-[0px_8px_24px_rgba(0,21,80,0.08)]"
          >
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                {/* Level + Category */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold tracking-widest uppercase rounded-full">
                    LEVEL {word.level}
                  </span>
                  <span className="h-px w-12 bg-outline-variant/30" />
                  <span className="text-on-surface-variant text-sm font-medium italic">
                    {word.category}
                  </span>
                </div>

                {/* Word + POS + Korean */}
                <div>
                  <h2 className="font-headline font-extrabold text-3xl text-primary mb-2">
                    {word.word}
                  </h2>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <span className="font-bold text-xs uppercase tracking-tighter text-on-tertiary-container">
                      {word.partOfSpeech}
                    </span>
                    <span className="text-lg font-medium">
                      {word.koreanMeaning}
                    </span>
                  </div>
                </div>

                {/* Synonyms */}
                <div className="pt-4 border-t border-outline-variant/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mr-2">
                      Synonyms
                    </span>
                    {word.synonyms.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 bg-surface-container text-on-secondary-container text-xs font-semibold rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary transition-all">
                  <span className="material-symbols-outlined">volume_up</span>
                </button>
                <button
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
                    word.starred
                      ? "bg-surface-container-low text-on-tertiary-container hover:bg-tertiary-fixed"
                      : "bg-surface-container-low text-outline-variant hover:text-on-tertiary-container"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={
                      word.starred
                        ? { fontVariationSettings: '"FILL" 1' }
                        : undefined
                    }
                  >
                    star
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between py-12 text-on-surface-variant text-sm border-t border-outline-variant/20 mt-12">
        <p>Total Words: 142</p>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">
              chevron_left
            </span>
            Previous
          </button>
          <span className="px-3 py-1 bg-surface-container-high rounded text-primary font-bold">
            1
          </span>
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            Next
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
