import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/teacher/students_/$studentId_/assigned-words/$studySetId')({
  component: lazyRouteComponent(
    () => import('@/pages/student/study-set-words/routeWrappers'),
    'TeacherStudentAssignedWordsRoute',
  ),
});
