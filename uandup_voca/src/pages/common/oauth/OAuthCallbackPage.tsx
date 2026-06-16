import { useEffect, useRef } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { loginWithGoogle } from '@/entities/auth';
import { isAxiosError } from 'axios';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    // 로그인 응답이 오기 전에 *가능한 목적지 lazy chunk*를 병렬로 미리 다운로드.
    // 응답 시점엔 청크가 캐시되어 있어 navigate 즉시 렌더된다.
    // 어느 destination으로 갈지 아직 모르므로 학생/선생님 둘 다 prefetch.
    router.preloadRoute({ to: '/student/dashboard' });
    router.preloadRoute({ to: '/teacher/students' });

    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      navigate({ to: '/' });
      return;
    }

    loginWithGoogle(code)
      .then(({ data }) => {
        localStorage.setItem('accessToken', data.accessToken ?? '');

        if (data.status === 'PROFILE_INCOMPLETE') {
          navigate({ to: '/onboarding' });
        } else if (data.status === 'PENDING_APPROVAL') {
          navigate({ to: '/pending' });
        } else if (data.role === 'PARENT') {
          // 학부모 전용 화면이 아직 없다 — ACTIVE라도 PendingPage에 머물며,
          // 자녀 매칭 여부에 따라 PendingPage가 문구를 분기한다.
          navigate({ to: '/pending' });
        } else {
          navigate({ to: data.role === 'STUDENT' ? '/student' : '/teacher' });
        }
      })
      .catch((error) => {
        if (isAxiosError(error) && error.response?.status === 403) {
          navigate({ to: '/pending' });
        } else {
          navigate({ to: '/' });
        }
      });
  }, [navigate, router]);

  return (
    <div className="min-h-dvh bg-surface flex items-center justify-center">
      <span className="material-symbols-outlined text-primary text-4xl">progress_activity</span>
    </div>
  );
}
