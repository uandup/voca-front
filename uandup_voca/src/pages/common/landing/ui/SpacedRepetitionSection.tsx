import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['spaced'];
}

export function SpacedRepetitionSection({ t }: Props) {
  return (
    <section className="min-h-140 py-28 px-6 bg-surface-container-low border-y border-outline-variant">
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
          <div className="h-16 flex flex-col items-center justify-center">
            {t.body.lines.map((sentence, i) => (
              <p
                key={i}
                className="text-on-surface-variant leading-relaxed"
                style={{ fontSize: t.body.fontSize }}
              >
                {sentence}
              </p>
            ))}
          </div>
        </FadeIn>

        <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-6">
          {t.steps.map((step, idx) => (
            <FadeIn key={step.day} delay={idx * 100} className="relative">
              <div className="h-44 rounded-2xl bg-surface-container-lowest border border-outline-variant premium-shadow p-5 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300 ">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-secondary-container bg-secondary-container px-2.5 py-0.5 rounded-full">
                    {step.day}
                  </span>
                  <span className="material-symbols-outlined text-primary text-lg">
                    {step.icon}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface text-sm mb-1">{step.label}</p>
                  {step.desc.map((line, i) => (
                    <p key={i} className="text-on-surface-variant text-xs leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              {idx < t.steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-5.5 -translate-y-1/2 z-10 items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary/80"
                    style={{ fontSize: '20px' }}
                  >
                    arrow_forward
                  </span>
                </div>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
