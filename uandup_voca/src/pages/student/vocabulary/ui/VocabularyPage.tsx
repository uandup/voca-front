import { VocabCard } from "./VocabCard";

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
    partOfSpeech: "N",
    koreanMeaning: "모호함, 다의성",
    synonyms: ["vague", "obscurity", "uncertainty"],
    starred: false,
  },
  {
    id: 2,
    level: 4,
    category: "Scholarly Prose",
    word: "Juxtaposition",
    partOfSpeech: "N",
    koreanMeaning: "병치, 나란히 놓기",
    synonyms: ["comparison", "proximity", "adjacency"],
    starred: false,
  },
  {
    id: 3,
    level: 3,
    category: "Literature Analysis",
    word: "Inherent",
    partOfSpeech: "Adj",
    koreanMeaning: "내재하는, 본질적인",
    synonyms: ["intrinsic", "innate", "essential"],
    starred: false,
  },
  {
    id: 4,
    level: 5,
    category: "Advanced Dialectic",
    word: "Pragmatic",
    partOfSpeech: "Adj",
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
          <VocabCard
            key={word.id}
            level={word.level}
            word={word.word}
            partOfSpeech={word.partOfSpeech}
            koreanMeaning={word.koreanMeaning}
            synonyms={word.synonyms}
            starred={word.starred}
          />
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
