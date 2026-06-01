import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { WordCard } from '@/entities/word';
import { useAssignedWords } from '@/entities/student';

interface Props {
  studySetId: number;
  // BreadcrumbPageTitle의 parents 배열. 여러 단계(e.g. Student Management > 이름) 지원.
  parents: { label: string; onClick?: () => void }[];
  // breadcrumb의 현재 페이지 제목. 미전달 시 "Words".
  title?: string;
}

// 한 study-set에 배정된 단어 목록을 학생에게 보여주는 공통 페이지.
// word-test cycle / review-deck exam / level-test exam 세 곳에서 모두 동일한 흐름이라 재사용.
export function StudySetWordsPage({ studySetId, parents, title = 'Words' }: Props) {
  // 학생 화면이므로 예문 노출은 서버의 exampleVisible을 따른다
  // (NORMAL 배정은 예문시험 채점 완료 후에만 true).
  const { data, isLoading } = useAssignedWords(studySetId, studySetId > 0);
  const words = data?.words ?? [];
  const exampleVisible = data?.exampleVisible ?? false;

  return (
    <main>
      <BreadcrumbPageTitle parents={parents} title={title} />

      {isLoading ? (
        <LoadingSpinner />
      ) : words.length === 0 ? (
        <EmptyState title="No words assigned." />
      ) : (
        <div className="space-y-5">
          {words.map((word) => (
            <WordCard key={word.id} {...word} showSentence={exampleVisible} />
          ))}
        </div>
      )}
    </main>
  );
}
