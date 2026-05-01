import { useRouter, useParams } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { VocabCard, MOCK_CYCLE_WORDS } from '@/entities/word';
// import { StarButton } from './ui/StarButton';

const CYCLE_META: Record<string, { level: number; wordCount: number }> = {
  '1': { level: 7, wordCount: 50 },
  '2': { level: 3, wordCount: 47 },
  '3': { level: 5, wordCount: 30 },
};

export default function VocabListPage() {
  const router = useRouter();
  const { id } = useParams({ from: '/student/word-test/$id/words' });
  const meta = CYCLE_META[id];

  return (
    <main>
      <BreadcrumbPageTitle
        parents={[{ label: 'Word Test', onClick: () => router.history.back() }]}
        title={meta ? `Level ${meta.level} · Words ${meta.wordCount}` : 'Vocabulary'}
      />

      <div className="space-y-5">
        {MOCK_CYCLE_WORDS.map((word) => (
          <VocabCard
            key={word.id}
            difficultyLevel={word.difficultyLevel}
            word={word.word}
            partOfSpeech={word.partOfSpeech}
            korMeaning={word.korMeaning}
            engMeaning={word.engMeaning}
            synonyms={word.synonyms}
            // extraInfo={<StarButton wordId={word.id} starred={word.starred} />}
          />
        ))}
      </div>
    </main>
  );
}
