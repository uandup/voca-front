import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['analytics'];
}

export function AnalyticsSection({ t }: Props) {
  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          {/* 헤드라인: 2줄 고정 */}
          <div className="h-24 flex flex-col items-center justify-center mb-4">
            {t.headline.lines.map((line, i) => (
              <h2
                key={i}
                className="font-headline font-extrabold text-primary leading-snug"
                style={{ fontSize: t.headline.fontSize }}
              >
                {line}
              </h2>
            ))}
          </div>
          {/* 본문: 2문장 고정 */}
          <div className="h-16 flex flex-col items-center justify-center max-w-xl mx-auto">
            {t.body.lines.map((sentence, i) => (
              <p key={i} className="text-on-surface-variant leading-relaxed" style={{ fontSize: t.body.fontSize }}>
                {sentence}
              </p>
            ))}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.metrics.map((m, idx) => (
            <FadeIn key={m.label} delay={idx * 80}>
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant premium-shadow text-center hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-on-primary text-xl">
                    {m.icon}
                  </span>
                </div>
                <p className="font-semibold text-on-surface text-sm mb-1.5">{m.label}</p>
                <p className="text-on-surface-variant text-xs leading-relaxed">{m.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
