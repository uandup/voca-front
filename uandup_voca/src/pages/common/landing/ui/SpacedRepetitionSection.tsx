import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['spaced'];
}

export function SpacedRepetitionSection({ t }: Props) {
  return (
    <section className="py-28 px-6 bg-surface-container-low border-y border-outline-variant">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <span className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-3 block">
            {t.label}
          </span>
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
            {t.body.map((sentence, i) => (
              <p key={i} className="text-on-surface-variant text-sm leading-relaxed">
                {sentence}
              </p>
            ))}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.steps.map((step, idx) => (
            <FadeIn key={step.day} delay={idx * 100} className="relative flex flex-col">
              {idx < t.steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-10px)] w-5 h-0.5 bg-outline-variant z-0" />
              )}
              <div className="flex-1 rounded-2xl bg-surface-container-lowest border border-outline-variant premium-shadow p-5 flex flex-col gap-3 relative z-10 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-secondary-container bg-secondary-container px-2.5 py-0.5 rounded-full">
                    {step.day}
                  </span>
                  <span className="material-symbols-outlined text-primary text-lg">{step.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface text-sm mb-1">{step.label}</p>
                  <p className="text-on-surface-variant text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {idx < t.steps.length - 1 && (
                <div className="lg:hidden flex justify-center py-1">
                  <span className="material-symbols-outlined text-outline-variant text-base">
                    arrow_downward
                  </span>
                </div>
              )}
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={400}>
          <p className="text-center text-on-surface-variant text-xs mt-8">{t.footnote}</p>
        </FadeIn>
      </div>
    </section>
  );
}
