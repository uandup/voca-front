import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getMyInfo, toMember } from '@/entities/member';
import { OnboardingNav } from '../onboarding/ui/OnboardingNav';

export default function PendingPage() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    getMyInfo()
      .then(({ data }) => {
        const member = toMember(data);

        if (member.status === 'PROFILE_INCOMPLETE') {
          navigate({ to: '/onboarding' });
        } else if (member.status === 'ACTIVE') {
          navigate({ to: member.role === 'STUDENT' ? '/student' : '/teacher' });
        }
      })
      .catch(() => {
        // 조회 실패 시 현재 페이지 유지. 401은 axios 인터셉터가 처리.
      });
  }, [navigate]);

  return (
    <div className="min-h-screen primary-gradient flex flex-col">
      <OnboardingNav onLogoClick={() => navigate({ to: '/' })} />

      <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
        <img
          src="/landing_hero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none"
        />

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-surface rounded-2xl p-10 shadow-[0_8px_40px_rgba(0,0,0,0.22)] text-center">
            {/* Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">schedule</span>
              </div>
            </div>

            <h1 className="font-headline font-extrabold text-on-surface text-2xl mb-3">
              Awaiting Approval
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Your registration is under review by an administrator.
              <br />
              You'll be able to access the service once approved.
            </p>

            {/* Notice */}
            <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-xl bg-secondary-container/30 border border-outline-variant text-left">
              <span className="material-symbols-outlined text-base text-on-surface-variant mt-0.5 shrink-0">
                info
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Approval may take some time.
                <br />
                Please sign in again once you receive confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
