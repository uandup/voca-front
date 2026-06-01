import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useRouter } from '@tanstack/react-router';
import { WordCard } from '@/entities/word';
import { useReviewDeckWords } from '@/entities/review-deck';
import { useCurrentStudentId } from '@/entities/auth';

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
        <LoadingSpinner />
      ) : words.length === 0 ? (
        <EmptyState title="No active incorrect words." />
      ) : (
        <div className="space-y-5">
          {words.map((word) => (
            <WordCard
              key={word.id}
              {...word}
              showSentence
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
