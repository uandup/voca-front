import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { useRouter } from '@tanstack/react-router';
import { StudentWordCard } from '@/entities/word';
import { useReviewDeckWords } from '@/features/review-deck-exam';
import { useCurrentStudentId } from '@/shared/jwt';

export default function WrongWordListPage() {
  const router = useRouter();
  const studentId = useCurrentStudentId() ?? 0;
  const { data: words = [], isLoading } = useReviewDeckWords(studentId, studentId > 0);

  return (
    <main>
      <BreadcrumbPageTitle
        parents={[{ label: 'Review Deck', onClick: () => router.history.back() }]}
        title="Word List"
      />
      {isLoading ? (
        <p className="text-sm text-on-surface-variant text-center py-12">Loading...</p>
      ) : words.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-12">
          No active incorrect words.
        </p>
      ) : (
        <div className="space-y-5">
          {words.map((word) => (
            <StudentWordCard
              key={word.id}
              difficulty={word.difficulty}
              word={word.word}
              partsOfSpeech={word.partsOfSpeech}
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
      )}
    </main>
  );
}
