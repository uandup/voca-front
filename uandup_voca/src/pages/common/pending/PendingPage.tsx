import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getMyInfo, toMember } from '@/entities/member';
import { getActiveChildId, setActiveChildId } from '@/shared/jwt';
import { OnboardingNav } from '../onboarding/ui/OnboardingNav';

// PendingPage가 표시할 두 가지 안내 — 일반 승인 대기 vs 학부모 자녀 매칭 대기.
type PendingVariant = 'approval' | 'parentNoChild';

export default function PendingPage() {
  const navigate = useNavigate();
  const called = useRef(false);

  // 학부모 전용 화면이 없어 ACTIVE 학부모도 이 페이지에 머문다 —
  // 자녀가 매칭되지 않은 학부모는 'parentNoChild' 문구로 분기한다.
  const [variant, setVariant] = useState<PendingVariant>('approval');

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    getMyInfo()
      .then(({ data }) => {
        const member = toMember(data);

        if (member.status === 'PROFILE_INCOMPLETE') {
          navigate({ to: '/onboarding' });
          return;
        }

        if (member.role === 'PARENT') {
          const children = member.children ?? [];
          if (member.status === 'ACTIVE' && children.length > 0) {
            // 자녀가 매칭된 학부모는 자녀 페이지를 읽기전용으로 공유한다.
            // 마지막으로 본 자녀가 아직 유효하면 그대로 복원하고, 아니면 첫 자녀로 fallback한다.
            const lastViewedId = getActiveChildId();
            const restored = children.find((c) => c.studentId === lastViewedId);
            setActiveChildId((restored ?? children[0]).studentId);
            navigate({ to: '/student/dashboard' });
            return;
          }
          // 승인 대기 중이거나, ACTIVE라도 자녀가 아직 없으면 이 페이지에 머문다.
          if (member.status === 'ACTIVE') {
            setVariant('parentNoChild');
          }
          return;
        }

        if (member.status === 'ACTIVE') {
          navigate({ to: member.role === 'STUDENT' ? '/student' : '/teacher' });
        }
      })
      .catch(() => {
        // 조회 실패 시 현재 페이지 유지. 401은 axios 인터셉터가 처리.
      });
  }, [navigate]);

  const isParentNoChild = variant === 'parentNoChild';

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
                <span className="material-symbols-outlined text-primary text-4xl">
                  {isParentNoChild ? 'family_restroom' : 'schedule'}
                </span>
              </div>
            </div>

            {isParentNoChild ? (
              <>
                <h1 className="font-headline font-extrabold text-on-surface text-2xl mb-3">
                  Waiting for a Linked Child
                </h1>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                  Your account has been approved.
                  <br />
                  You'll be able to access the service once a child is linked to your account.
                </p>

                {/* Notice */}
                <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-xl bg-secondary-container/30 border border-outline-variant text-left">
                  <span className="material-symbols-outlined text-base text-on-surface-variant mt-0.5 shrink-0">
                    info
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    A child is linked by an administrator.
                    <br />
                    Please sign in again once your child has been linked.
                  </p>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
