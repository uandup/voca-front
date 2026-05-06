import { useNavigate } from '@tanstack/react-router';
import { OnboardingNav } from './ui/OnboardingNav';
import { OnboardingHero } from './ui/OnboardingHero';
import { OnboardingForm } from './ui/OnboardingForm';

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen primary-gradient flex flex-col">
      <OnboardingNav onLogoClick={() => navigate({ to: '/' })} />

      <div className="flex-1 flex relative overflow-hidden">
        <img
          src="/landing_hero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none"
        />
        <OnboardingHero />
        <OnboardingForm />
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
