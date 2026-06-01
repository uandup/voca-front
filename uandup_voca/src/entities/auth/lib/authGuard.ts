import { redirect } from '@tanstack/react-router';
import { getTokenPayload } from '../model/jwt';

// 보호된 라우트의 beforeLoad에서 호출. accessToken이 없으면 랜딩 페이지로 리다이렉트.
// 역할 제한이 필요 없는 라우트(/onboarding, /pending 등)에 사용한다.
export function requireAuth() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw redirect({ to: '/' });
  }
}

// /teacher 영역 가드 — TEACHER만 허용. 그 외 역할은 학생 영역으로 보낸다.
// 토큰이 없거나 디코드 실패면 랜딩 페이지로 폴백한다.
export function requireTeacher() {
  const payload = getTokenPayload();
  if (!payload) {
    throw redirect({ to: '/' });
  }
  if (payload.role !== 'TEACHER') {
    throw redirect({ to: '/student/dashboard' });
  }
}

// /student 영역 가드 — STUDENT(본인) 또는 PARENT(자녀 열람)만 허용.
// TEACHER는 학생 페이지로 잘못 진입하지 않도록 선생님 영역으로 리다이렉트한다.
export function requireStudentArea() {
  const payload = getTokenPayload();
  if (!payload) {
    throw redirect({ to: '/' });
  }
  if (payload.role !== 'STUDENT' && payload.role !== 'PARENT') {
    throw redirect({ to: '/teacher/students' });
  }
}
