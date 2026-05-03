import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { useRouter } from '@tanstack/react-router';
import { VocabCard, MOCK_WRONG_WORDS } from '@/entities/word';

export default function WrongWordListPage() {
  const router = useRouter();

  return (
    <main>
      <BreadcrumbPageTitle
        parents={[{ label: 'Review Deck', onClick: () => router.history.back() }]}
        title="Word List"
      />
      <div className="space-y-5">
        {MOCK_WRONG_WORDS.map((word) => (
          <VocabCard
            key={word.id}
            difficultyLevel={word.difficultyLevel}
            word={word.word}
            partOfSpeech={word.partOfSpeech}
            korMeaning={word.korMeaning}
            engMeaning={word.engMeaning}
            synonyms={word.synonyms}
            extraInfo={
              <div className="flex flex-col items-center justify-center px-2 py-2 bg-error/5 border border-error/20 rounded-lg">
                <span className="text-[8px] uppercase tracking-widest font-bold text-error/60">
                  Wrong
                </span>
                <span className="text-md font-bold text-error">{word.wrongCount}</span>
              </div>
            }
          />
        ))}
      </div>
    </main>
  );
}
