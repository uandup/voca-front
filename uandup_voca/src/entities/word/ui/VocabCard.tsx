import type { ReactNode } from 'react';
import type { Word } from '../model/types';

interface VocabCardProps extends Pick<
  Word,
  'word' | 'partOfSpeech' | 'koreanMeaning' | 'englishMeaning' | 'synonyms' | 'difficultyLevel'
> {
  extraInfo?: ReactNode;
}

export function VocabCard({
  difficultyLevel,
  word,
  partOfSpeech,
  koreanMeaning,
  englishMeaning,
  synonyms,
  extraInfo,
}: VocabCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface-container-lowest py-5 px-6 border shadow-sm border-outline-variant/60">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="w-full md:w-1/3 space-y-2">
          <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold tracking-widest uppercase rounded-full">
            LEVEL {difficultyLevel}
          </span>
          <h2 className="font-headline font-bold text-2xl text-primary">{word}</h2>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-1">
              Meaning
            </h4>
            <p className="text-primary font-bold text-lg">
              <span className="text-on-tertiary-container tracking-wider mr-2">{partOfSpeech}</span>
              {koreanMeaning}
            </p>
            <p className="text-sm text-on-surface-variant mt-1">{englishMeaning}</p>
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

        {extraInfo && <div className="shrink-0">{extraInfo}</div>}
      </div>
    </div>
  );
}
