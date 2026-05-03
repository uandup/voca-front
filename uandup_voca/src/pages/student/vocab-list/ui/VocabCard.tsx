interface VocabularyCardProps {
  level: number;
  word: string;
  partOfSpeech: string;
  korMeaning: string;
  engMeaning: string;
  synonyms: string[];
  starred: boolean;
}

export function VocabCard({
  level,
  word,
  partOfSpeech,
  korMeaning,
  engMeaning,
  synonyms,
  // starred,
}: VocabularyCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface-container-lowest py-5 px-6 border shadow-sm border-outline-variant/60 ">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        {/* Column 1: Level + Word */}
        <div className="w-full md:w-1/3 space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold tracking-widest uppercase rounded-full">
              LEVEL {level}
            </span>
          </div>
          <h2 className="font-headline font-bold text-2xl text-primary">{word}</h2>
        </div>

        {/* Column 2: Meaning + Synonyms */}
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-1">
              Meaning
            </h4>
            <p className="text-primary font-bold text-lg">
              <span className="text-on-tertiary-container tracking-wider mr-2">{partOfSpeech}</span>
              {korMeaning}
            </p>
            <p className="text-sm text-on-surface-variant mt-1">{engMeaning}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">
              Synonyms
            </h4>
            <div className="flex flex-wrap gap-2">
              {synonyms.map((s) => (
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
        {/* <div className="flex items-center gap-4">
          <button
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
              starred
                ? 'bg-surface-container-low text-on-tertiary-container hover:bg-tertiary-fixed'
                : 'bg-surface-container-low text-outline-variant hover:text-on-tertiary-container'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={starred ? { fontVariationSettings: '"FILL" 1' } : undefined}
            >
              star
            </span>
          </button>
        </div> */}
      </div>
    </div>
  );
}
