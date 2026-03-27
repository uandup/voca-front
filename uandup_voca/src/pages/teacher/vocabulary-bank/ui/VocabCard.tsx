import { useState } from "react";
import type { Vocab } from "@/entities/vocab";
import { VocabModal } from "./modals/VocabModal";
import { DeleteVocabModal } from "./modals/DeleteVocabModal";

type VocabCardProps = Vocab;

export function VocabCard({
  word,
  partOfSpeech,
  koreanMeaning,
  difficultyLevel,
  englishMeaning,
  synonyms,
  exampleSentence,
}: VocabCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden border shadow-sm border-outline-variant/60 relative group">
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        <button
          onClick={() => setIsEditOpen(true)}
          className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-xs font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Delete
        </button>
      </div>

      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Column 1: Level + Word */}
          <div className="w-1/4">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold tracking-widest uppercase rounded-full">
                LEVEL {difficultyLevel}
              </span>
            </div>
            <h2 className="font-headline font-bold text-2xl text-primary">
              {word}
            </h2>
          </div>

          {/* Column 2: Meaning + Synonyms */}
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">
                Meaning
              </h4>
              <p className="text-primary font-bold text-lg">
                <span className="text-on-tertiary-container tracking-wider mr-2">
                  {partOfSpeech}
                </span>
                {koreanMeaning}
              </p>
              <p className="text-on-surface-variant leading-relaxed font-body text-sm mt-1">
                {englishMeaning}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">
                Synonyms
              </h4>
              <div className="flex flex-wrap gap-2">
                {synonyms.map((syn) => (
                  <span
                    key={syn}
                    className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    {syn}
                  </span>
                ))}
              </div>
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
            "{exampleSentence}"
          </p>
        </div>
      </div>

      {isEditOpen && (
        <VocabModal
          initialData={{
            word,
            partOfSpeech,
            koreanMeaning,
            difficultyLevel,
            englishMeaning,
            synonyms,
            exampleSentence,
          }}
          onClose={() => setIsEditOpen(false)}
          onSave={(data) => {
            console.log(data);
            setIsEditOpen(false);
          }}
        />
      )}

      {isDeleteOpen && (
        <DeleteVocabModal
          word={word}
          onClose={() => setIsDeleteOpen(false)}
          onDelete={() => {
            console.log("delete", word);
            setIsDeleteOpen(false);
          }}
        />
      )}
    </article>
  );
}
