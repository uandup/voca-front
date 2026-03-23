interface VocabCardProps {
  level: number;
  levelColor: "primary" | "tertiary";
  word: string;
  synonyms: string[];
  partOfSpeech: string;
  koreanMeaning: string;
  definition: string;
  example: string;
}

const levelColorMap = {
  primary: "bg-primary-container text-on-primary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
};

export function VocabCard({
  level,
  levelColor,
  word,
  synonyms,
  partOfSpeech,
  koreanMeaning,
  definition,
  example,
}: VocabCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_8px_24px_rgba(0,21,80,0.08)] hover:shadow-[0px_12px_32px_rgba(0,21,80,0.12)] transition-shadow relative group">
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        <button className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold">
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit
        </button>
        <button className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-xs font-bold">
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Delete
        </button>
      </div>

      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Column 1: Identity & Synonyms */}
          <div className="w-full lg:w-1/3">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`${levelColorMap[levelColor]} px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase`}
              >
                Level {level}
              </span>
            </div>
            <h2 className="font-headline font-extrabold text-4xl text-primary mb-4">
              {word}
            </h2>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">
                Synonyms
              </h4>
              <div className="flex flex-wrap gap-2">
                {synonyms.map((syn) => (
                  <span
                    key={syn}
                    className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-medium "
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Meaning */}
          <div className="flex-1">
            <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-3">
              Definition &amp; Part of Speech
            </h4>
            <div className="space-y-2">
              <p className="text-primary font-bold text-lg">
                {partOfSpeech}. {koreanMeaning}
              </p>
              <p className="text-on-surface-variant leading-relaxed font-body">
                {definition}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Bottom: Example */}
      <div className="px-8 py-5 bg-surface-container-low border-t border-outline-variant/10">
        <div className="flex gap-3 items-baseline">
          <span className="text-md uppercase tracking-wider text-outline font-bold shrink-0">
            Example:
          </span>
          <p className="text-on-surface-variant text-md font-medium leading-relaxed">
            "{example}"
          </p>
        </div>
      </div>
    </article>
  );
}
