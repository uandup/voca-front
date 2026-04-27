import { useState } from 'react';
import { LANDING_CONTENT, type Lang } from './model/landingContent';
import { LandingNav } from './ui/LandingNav';
import { HeroSection } from './ui/HeroSection';
import { CurriculumSection } from './ui/CurriculumSection';
import { SpacedRepetitionSection } from './ui/SpacedRepetitionSection';
import { WrongWordSection } from './ui/WrongWordSection';
import { LevelTestSection } from './ui/LevelTestSection';
import { AnalyticsSection } from './ui/AnalyticsSection';
import { CtaSection } from './ui/CtaSection';

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en');
  const t = LANDING_CONTENT[lang];

  const toggleLang = () => setLang((l) => (l === 'en' ? 'ko' : 'en'));

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface overflow-x-hidden">
      <LandingNav lang={lang} t={t.nav} onToggleLang={toggleLang} />
      <div key={lang}>
        <HeroSection t={t.hero} />
        <CurriculumSection t={t.curriculum} />
        <SpacedRepetitionSection t={t.spaced} />
        <WrongWordSection t={t.wrongWord} />
        <LevelTestSection t={t.levelTest} />
        <AnalyticsSection t={t.analytics} />
        <CtaSection t={t.cta} />

        <footer className="py-8 px-6 border-t border-outline-variant text-center">
          <p className="text-on-surface-variant text-xs">{t.footer}</p>
        </footer>
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
