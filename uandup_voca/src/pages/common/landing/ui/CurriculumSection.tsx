import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['curriculum'];
}

export function CurriculumSection({ t }: Props) {
  return (
    <section className="min-h-150 flex items-center py-28 px-6">
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
          <div className="h-16 flex flex-col justify-center">
            {t.body.map((sentence, i) => (
              <p key={i} className="text-on-surface-variant text-sm leading-relaxed">
                {sentence}
              </p>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={150} className="flex-1 w-full max-w-md">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant premium-shadow p-6 space-y-3">
            {Array.from({ length: 10 }, (_, i) => {
              const level = i + 1;
              const filled = level <= 4;
              const current = level === 5;
              const pct = filled ? 100 : current ? 55 : 0;
              return (
                <div key={level} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-on-surface-variant w-12 shrink-0">
                    Lv. {level}
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        filled ? 'bg-primary' : current ? 'bg-primary/50' : 'bg-surface-dim'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-on-surface-variant w-16 text-right shrink-0">
                    {filled ? t.completed : current ? t.inProgress : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
