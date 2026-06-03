import { useNavigate, useParams } from '@tanstack/react-router';
import { useStudentOverview } from '@/entities/student';
import { StudySetWordsPage } from './StudySetWordsPage';

// 각 라우트는 동일한 StudySetWordsPage를 보여주지만 URL param 키와 back 라벨이 다르다.
// react-refresh / hooks 규칙을 만족시키기 위해 (1) 각 wrapper를 named 컴포넌트로 두고
// (2) 라우트 파일은 이 wrapper만 import해서 component:로 넘긴다 — 라우트 파일에는
// 컴포넌트 정의가 없게 되어 only-export-components 경고가 뜬지 않는다.

export function WordTestStudySetWordsRoute() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/student/word-test/$id/words' });
  return (
    <StudySetWordsPage
      studySetId={Number(id)}
      parents={[{ label: 'Word Test', onClick: () => navigate({ to: '/student/word-test' }) }]}
    />
  );
}

export function LevelTestStudySetWordsRoute() {
  const navigate = useNavigate();
  const { studySetId } = useParams({ from: '/student/level-test/$studySetId/words' });
  return (
    <StudySetWordsPage
      studySetId={Number(studySetId)}
      parents={[{ label: 'Level Test', onClick: () => navigate({ to: '/student/level-test' }) }]}
    />
  );
}

export function ReviewDeckStudySetWordsRoute() {
  const navigate = useNavigate();
  const { studySetId } = useParams({ from: '/student/review-deck/$studySetId/words' });
  return (
    <StudySetWordsPage
      studySetId={Number(studySetId)}
      parents={[{ label: 'Review Deck', onClick: () => navigate({ to: '/student/review-deck' }) }]}
    />
  );
}

// 대시보드 StatCards "Assigned Words" 카드 진입점 (학생).
// 뒤로 가면 /student/dashboard로 복귀한다.
export function DashboardAssignedWordsRoute() {
  const navigate = useNavigate();
  const { studySetId } = useParams({ from: '/student/dashboard_/assigned-words/$studySetId' });
  return (
    <StudySetWordsPage
      studySetId={Number(studySetId)}
      parents={[{ label: 'Dashboard', onClick: () => navigate({ to: '/student/dashboard' }) }]}
      title="Assigned Words"
    />
  );
}

// 선생님이 학생 대시보드 StatCards "Assigned Words" 카드에서 진입.
// 뒤로 가면 해당 학생 대시보드로 복귀한다.
// breadcrumb: Student Management > 학생이름 > Assigned Words
export function TeacherStudentAssignedWordsRoute() {
  const navigate = useNavigate();
  const { studentId, studySetId } = useParams({
    from: '/teacher/students_/$studentId_/assigned-words/$studySetId',
  });
  const { data: overview } = useStudentOverview(Number(studentId));

  return (
    <StudySetWordsPage
      studySetId={Number(studySetId)}
      parents={[
        {
          label: 'Student Management',
          onClick: () => navigate({ to: '/teacher/students' }),
        },
        {
          label: overview?.nameKo ?? '...',
          onClick: () => navigate({ to: '/teacher/students/$studentId', params: { studentId } }),
        },
      ]}
      title="Assigned Words"
    />
  );
}
