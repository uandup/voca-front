import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loginWithGoogle } from '@/entities/auth';
import { isAxiosError } from 'axios';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

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
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-primary text-4xl">
        progress_activity
      </span>
    </div>
  );
}
