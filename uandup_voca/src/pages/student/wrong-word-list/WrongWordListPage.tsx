import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { useRouter } from '@tanstack/react-router';
import { VocabCard } from '@/entities/vocab';

interface WrongVocabWord {
  id: number;
  level: number;
  word: string;
  partOfSpeech: string;
  koreanMeaning: string;
  englishMeaning: string;
  synonyms: string[];
  wrongCount: number;
}

const mockWrongWords: WrongVocabWord[] = [
  {
    id: 1,
    level: 3,
    word: 'Ambiguity',
    partOfSpeech: 'N',
    koreanMeaning: '모호함, 다의성',
    englishMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    wrongCount: 5,
  },
  {
    id: 2,
    level: 4,
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    koreanMeaning: '병치, 나란히 놓기',
    englishMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    wrongCount: 3,
  },
];

export default function WrongWordListPage() {
  const router = useRouter();

  return (
    <main>
      <BreadcrumbPageTitle
        parents={[{ label: 'Wrong Word Bank', onClick: () => router.history.back() }]}
        title="Wrong Word List"
      />
      <div className="space-y-5">
        {mockWrongWords.map((word) => (
          <VocabCard
            key={word.id}
            level={word.level}
            word={word.word}
            partOfSpeech={word.partOfSpeech}
            koreanMeaning={word.koreanMeaning}
            englishMeaning={word.englishMeaning}
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
