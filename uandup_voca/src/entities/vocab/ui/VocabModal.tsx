import { useState } from "react";

export interface VocabFormData {
  word: string;
  partOfSpeech: "Noun" | "Verb" | "Adjective" | "Adverb" | "Conjunction";
  koreanMeaning: string;
  difficultyLevel: 1 | 2 | 3 | 4;
  englishMeaning: string;
  synonyms: string[];
  exampleSentence: string;
}

interface VocabModalProps {
  onClose: () => void;
  onSave: (data: VocabFormData) => void;
  initialData?: Partial<VocabFormData>;
}

const PARTS_OF_SPEECH: VocabFormData["partOfSpeech"][] = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Conjunction",
];

export function VocabModal({ onClose, onSave, initialData }: VocabModalProps) {
  const [word, setWord] = useState(initialData?.word ?? "");
  const [partOfSpeech, setPartOfSpeech] = useState<
    VocabFormData["partOfSpeech"]
  >(initialData?.partOfSpeech ?? "Noun");
  const [koreanMeaning, setKoreanMeaning] = useState(
    initialData?.koreanMeaning ?? ""
  );
  const [difficultyLevel, setDifficultyLevel] = useState<1 | 2 | 3 | 4>(
    initialData?.difficultyLevel ?? 1
  );
  const [englishMeaning, setEnglishMeaning] = useState(
    initialData?.englishMeaning ?? ""
  );
  const [synonyms, setSynonyms] = useState<string[]>(
    initialData?.synonyms ?? []
  );
  const [synonymInput, setSynonymInput] = useState("");
  const [exampleSentence, setExampleSentence] = useState(
    initialData?.exampleSentence ?? ""
  );

  function handleSynonymKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && synonymInput.trim()) {
      e.preventDefault();
      setSynonyms((prev) => [...prev, synonymInput.trim()]);
      setSynonymInput("");
    }
  }

  function removeSynonym(index: number) {
    setSynonyms((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    onSave({
      word,
      partOfSpeech,
      koreanMeaning,
      difficultyLevel,
      englishMeaning,
      synonyms,
      exampleSentence,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-[640px] my-auto rounded-[24px] shadow-[0px_24px_64px_rgba(0,27,95,0.12)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-start">
          <div>
            <h2 className="font-headline text-[32px] font-extrabold text-primary leading-tight">
              Add New Word
            </h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Expand your curated vocabulary set.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-10 pb-10 space-y-8">
          {/* Row 1: Word & POS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-1 block">
                Word
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-headline font-bold text-primary text-lg placeholder:text-on-surface-variant/30"
                placeholder="e.g. Ephemeral"
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-1 block">
                Part of Speech
              </label>
              <div className="relative">
                <select
                  className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer text-on-surface-variant pr-10"
                  value={partOfSpeech}
                  onChange={(e) =>
                    setPartOfSpeech(
                      e.target.value as VocabFormData["partOfSpeech"]
                    )
                  }
                >
                  {PARTS_OF_SPEECH.map((pos) => (
                    <option key={pos}>{pos}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Korean Meaning & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-1 block">
                Korean Meaning
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant placeholder:text-on-surface-variant/30"
                placeholder="뜻을 입력하세요"
                type="text"
                value={koreanMeaning}
                onChange={(e) => setKoreanMeaning(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-1 block">
                Difficulty Level
              </label>
              <div className="flex p-1 bg-surface-container-low rounded-xl h-[56px] items-center">
                {([1, 2, 3, 4] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficultyLevel(level)}
                    className={`flex-1 h-full text-xs font-bold rounded-lg transition-colors ${
                      difficultyLevel === level
                        ? "bg-white shadow-sm text-primary"
                        : "text-on-surface-variant hover:bg-white/40"
                    }`}
                  >
                    L{level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* English Meaning */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-1 block">
              English Meaning
            </label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-on-surface-variant placeholder:text-on-surface-variant/30"
              placeholder="Describe the nuanced definition..."
              rows={2}
              value={englishMeaning}
              onChange={(e) => setEnglishMeaning(e.target.value)}
            />
          </div>

          {/* Synonyms */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-1 block">
              Synonyms
            </label>
            <div className="w-full bg-surface-container-low rounded-xl p-3 flex flex-wrap gap-2 items-center min-h-[56px]">
              {synonyms.map((syn, i) => (
                <div
                  key={i}
                  className="pl-3 pr-2 py-1.5 bg-white text-primary rounded-lg text-[13px] font-semibold flex items-center gap-2 shadow-sm border border-black/5"
                >
                  {syn}
                  <button
                    type="button"
                    onClick={() => removeSynonym(i)}
                    className="flex items-center justify-center hover:bg-surface-container-low rounded-md p-0.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                </div>
              ))}
              <input
                className="bg-transparent border-none focus:ring-0 outline-none p-1 text-[13px] flex-grow min-w-[150px] text-on-surface-variant placeholder:text-on-surface-variant/40"
                placeholder="Add synonym and press Enter..."
                type="text"
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                onKeyDown={handleSynonymKeyDown}
              />
            </div>
          </div>

          {/* Example Sentence */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-1 block">
              Example Sentence
            </label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none italic text-on-surface-variant placeholder:text-on-surface-variant/30"
              placeholder="Fashions are ephemeral; style is eternal."
              rows={3}
              value={exampleSentence}
              onChange={(e) => setExampleSentence(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-6 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-[15px] font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-10 py-4 bg-primary text-white text-[15px] font-bold rounded-xl shadow-[0px_8px_24px_rgba(0,27,95,0.2)] hover:bg-primary-container transition-all active:scale-95"
            >
              Save Word
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
