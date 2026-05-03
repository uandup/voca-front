import { useRouter } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { StudentWordCard, MOCK_WORDS } from '@/entities/word';

export default function LevelWordListPage() {
  const router = useRouter();

  return (
    <main>
      <BreadcrumbPageTitle
        parents={[{ label: 'Level Test', onClick: () => router.history.back() }]}
        title="Level Word List"
      />
      <div className="space-y-5">
        {MOCK_WORDS.map((word) => (
          <StudentWordCard
            key={word.id}
            difficulty={word.difficulty}
            word={word.word}
            partOfSpeech={word.partOfSpeech}
            korMeaning={word.korMeaning}
            engMeaning={word.engMeaning}
            synonyms={word.synonyms}
          />
        ))}
      </div>
    </main>
  );
}
