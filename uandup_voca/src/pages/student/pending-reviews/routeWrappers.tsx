import { useNavigate, useParams } from '@tanstack/react-router';
import { useCurrentStudentId } from '@/entities/auth';
import { useStudentOverview } from '@/entities/student';
import { PendingReviewsPage } from './PendingReviewsPage';

// 각 진입 경로별로 studentId 출처와 parents(breadcrumb)가 다르다.
// react-refresh / hooks 규칙을 만족시키기 위해 named 컴포넌트로 분리한다.

// 학생 본인 진입 — JWT에서 studentId를 가져온다.
// breadcrumb: Dashboard > Words to Review
export function StudentPendingReviewsRoute() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;
  return (
    <PendingReviewsPage
      studentId={studentId}
      parents={[{ label: 'Dashboard', onClick: () => navigate({ to: '/student/dashboard' }) }]}
    />
  );
}

// 선생님 진입 — URL param의 studentId를 사용한다.
// breadcrumb: Student Management > 학생이름 > Words to Review
export function TeacherPendingReviewsRoute() {
  const navigate = useNavigate();
  const { studentId } = useParams({ from: '/teacher/students_/$studentId_/pending-reviews' });
  const { data: overview } = useStudentOverview(Number(studentId));

  return (
    <PendingReviewsPage
      studentId={Number(studentId)}
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
    />
  );
}
