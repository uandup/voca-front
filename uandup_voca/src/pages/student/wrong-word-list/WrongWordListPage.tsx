import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { useRouter } from '@tanstack/react-router';
import { VocabCard } from '@/entities/word';
import type { WordListItem } from '@/entities/word';

const mockWrongWords: WordListItem[] = [
  {
    id: 1,
    difficultyLevel: 3,
    word: 'Ambiguity',
    partOfSpeech: 'N',
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    exampleSentence: '',
    wrongCount: 5,
  },
  {
    id: 2,
    difficultyLevel: 4,
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    korMeaning: '병치, 나란히 놓기',
    engMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    exampleSentence: '',
    wrongCount: 3,
  },
];

export default function WrongWordListPage() {
  const router = useRouter();

  return (
    <main>
      <BreadcrumbPageTitle
        parents={[{ label: 'Review Deck', onClick: () => router.history.back() }]}
        title="Word List"
      />
      <div className="space-y-5">
        {mockWrongWords.map((word) => (
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
