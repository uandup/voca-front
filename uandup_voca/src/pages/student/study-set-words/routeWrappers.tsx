import { useNavigate, useParams, useRouter } from '@tanstack/react-router';
import { StudySetWordsPage } from './StudySetWordsPage';

// 각 라우트는 동일한 StudySetWordsPage를 보여주지만 URL param 키와 back 라벨이 다르다.
// react-refresh / hooks 규칙을 만족시키기 위해 (1) 각 wrapper를 named 컴포넌트로 두고
// (2) 라우트 파일은 이 wrapper만 import해서 component:로 넘긴다 — 라우트 파일에는
// 컴포넌트 정의가 없게 되어 only-export-components 경고가 뜬지 않는다.

export function WordTestStudySetWordsRoute() {
  const router = useRouter();
  const { id } = useParams({ from: '/student/word-test/$id/words' });
  return (
    <StudySetWordsPage
      studySetId={Number(id)}
      backLabel="Word Test"
      onBack={() => router.history.back()}
    />
  );
}

export function LevelTestStudySetWordsRoute() {
  const router = useRouter();
  const { studySetId } = useParams({ from: '/student/level-test/$studySetId/words' });
  return (
    <StudySetWordsPage
      studySetId={Number(studySetId)}
      backLabel="Level Test"
      onBack={() => router.history.back()}
    />
  );
}

export function ReviewDeckStudySetWordsRoute() {
  const router = useRouter();
  const { studySetId } = useParams({ from: '/student/review-deck/$studySetId/words' });
  return (
    <StudySetWordsPage
      studySetId={Number(studySetId)}
      backLabel="Review Deck"
      onBack={() => router.history.back()}
    />
  );
}

// 대시보드 StatCards "Assigned Words" 카드 진입점.
// 뒤로 가면 /student/dashboard로 복귀한다.
export function DashboardAssignedWordsRoute() {
  const navigate = useNavigate();
  const { studySetId } = useParams({ from: '/student/dashboard_/assigned-words/$studySetId' });
  return (
    <StudySetWordsPage
      studySetId={Number(studySetId)}
      backLabel="Dashboard"
      title="Assigned Words"
      onBack={() => navigate({ to: '/student/dashboard' })}
    />
  );
}
