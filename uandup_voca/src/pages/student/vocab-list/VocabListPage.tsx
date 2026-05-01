import { useRouter, useParams } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { VocabCard } from '@/entities/word';
import type { WordListItem } from '@/entities/word';
// import { StarButton } from './ui/StarButton';

const CYCLE_META: Record<string, { level: number; wordCount: number }> = {
  '1': { level: 7, wordCount: 50 },
  '2': { level: 3, wordCount: 47 },
  '3': { level: 5, wordCount: 30 },
};

const mockWords: WordListItem[] = [
  {
    id: 1,
    difficultyLevel: 3,
    category: 'Academic Core',
    word: 'Ambiguity',
    partOfSpeech: 'N',
    koreanMeaning: '모호함, 다의성',
    englishMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    exampleSentence: '',
    starred: false,
  },
  {
    id: 2,
    difficultyLevel: 4,
    category: 'Scholarly Prose',
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    koreanMeaning: '병치, 나란히 놓기',
    englishMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    exampleSentence: '',
    starred: false,
  },
  {
    id: 3,
    difficultyLevel: 3,
    category: 'Literature Analysis',
    word: 'Inherent',
    partOfSpeech: 'Adj',
    koreanMeaning: '내재하는, 본질적인',
    englishMeaning: 'Existing as a natural or permanent quality of something.',
    synonyms: ['intrinsic', 'innate', 'essential'],
    exampleSentence: '',
    starred: false,
  },
  {
    id: 4,
    difficultyLevel: 5,
    category: 'Advanced Dialectic',
    word: 'Pragmatic',
    partOfSpeech: 'Adj',
    koreanMeaning: '실용적인, 실제적인',
    englishMeaning:
      'Dealing with things sensibly and realistically based on practical considerations.',
    synonyms: ['practical', 'utilitarian', 'sensible'],
    exampleSentence: '',
    starred: false,
  },
];

export default function VocabListPage() {
  const router = useRouter();
  const { id } = useParams({ from: '/student/word-test/$id/vocabulary' });
  const meta = CYCLE_META[id];

  return (
    <main>
      <BreadcrumbPageTitle
        parents={[{ label: 'Word Test', onClick: () => router.history.back() }]}
        title={meta ? `Level ${meta.level} · Words ${meta.wordCount}` : 'Vocabulary'}
      />

      <div className="space-y-5">
        {mockWords.map((word) => (
          <VocabCard
            key={word.id}
            difficultyLevel={word.difficultyLevel}
            word={word.word}
            partOfSpeech={word.partOfSpeech}
            koreanMeaning={word.koreanMeaning}
            englishMeaning={word.englishMeaning}
            synonyms={word.synonyms}
            // extraInfo={<StarButton wordId={word.id} starred={word.starred} />}
          />
        ))}
      </div>
    </main>
  );
}
