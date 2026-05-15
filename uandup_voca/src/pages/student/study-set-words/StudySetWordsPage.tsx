import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { StudentWordCard } from '@/entities/word';
import { useAssignedWords } from '@/features/study-set';

interface Props {
  studySetId: number;
  backLabel: string;
  onBack: () => void;
}

// 한 study-set에 배정된 단어 목록을 학생에게 보여주는 공통 페이지.
// word-test cycle / review-deck exam / level-test exam 세 곳에서 모두 동일한 흐름이라 재사용.
export function StudySetWordsPage({ studySetId, backLabel, onBack }: Props) {
  const { data: words = [], isLoading } = useAssignedWords(studySetId, studySetId > 0);

  return (
    <main>
      <BreadcrumbPageTitle parents={[{ label: backLabel, onClick: onBack }]} title="Words" />

      {isLoading ? (
        <p className="text-sm text-on-surface-variant text-center py-12">Loading...</p>
      ) : words.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-12">No words assigned.</p>
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
            />
          ))}
        </div>
      )}
    </main>
  );
}
