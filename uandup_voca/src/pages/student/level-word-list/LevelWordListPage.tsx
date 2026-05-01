import { useRouter } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { VocabCard } from '@/entities/word';
import type { Word } from '@/entities/word';

const mockLevelWords: Word[] = [
  {
    id: 1,
    difficultyLevel: 4,
    word: 'Ambiguity',
    partOfSpeech: 'N',
    koreanMeaning: '모호함, 다의성',
    englishMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    exampleSentence: '',
  },
  {
    id: 2,
    difficultyLevel: 4,
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    koreanMeaning: '병치, 나란히 놓기',
    englishMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    exampleSentence: '',
  },
];

export default function LevelWordListPage() {
  const router = useRouter();

  return (
    <main>
      <BreadcrumbPageTitle
        parents={[{ label: 'Level Test', onClick: () => router.history.back() }]}
        title="Level Word List"
      />
      <div className="space-y-5">
        {mockLevelWords.map((word) => (
          <VocabCard
            key={word.id}
            difficultyLevel={word.difficultyLevel}
            word={word.word}
            partOfSpeech={word.partOfSpeech}
            koreanMeaning={word.koreanMeaning}
            englishMeaning={word.englishMeaning}
            synonyms={word.synonyms}
          />
        ))}
      </div>
    </main>
  );
}
