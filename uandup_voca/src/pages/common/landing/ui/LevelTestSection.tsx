import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['levelTest'];
}

export function LevelTestSection({ t }: Props) {
  return (
    <section className="min-h-150 flex items-center py-28 px-6 bg-surface-container-low border-y border-outline-variant">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-14 items-center w-full">
        <FadeIn className="flex-1">
          <span className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-3 block">
            {t.label}
          </span>
          {/* 헤드라인: 2줄 고정 */}
          <div className="h-24 flex flex-col justify-center mb-5">
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
          <div className="h-20 flex flex-col justify-center">
            {t.body.map((sentence, i) => (
              <p key={i} className="text-on-surface-variant text-sm leading-relaxed">
                {sentence}
              </p>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={150} className="flex-1 max-w-sm w-full">
          <div className="space-y-0">
            {t.flow.map((item, idx) => (
              <div key={item.label}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant premium-shadow hover:-translate-y-0.5 transition-transform duration-200">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.color}`}
                  >
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-on-surface">{item.label}</span>
                </div>
                {idx === 1 ? (
                  <div className="flex ml-4 my-1 gap-16">
                    <div className="w-0.5 h-4 bg-success rounded-full" />
                    <div className="w-0.5 h-4 bg-error rounded-full" />
                  </div>
                ) : idx < t.flow.length - 2 ? (
                  <div className="flex justify-start ml-8 my-1">
                    <div className="w-0.5 h-4 bg-outline-variant rounded-full" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
