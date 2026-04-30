import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['levelTest'];
}

export function LevelTestSection({ t }: Props) {
  return (
    <section className="min-h-120 flex items-center py-28 px-6 bg-surface-container-low border-none">
      <div className="max-w-5xl mx-auto w-full flex items-center gap-12">
        <FadeIn className="flex-6 flex flex-col gap-5">
          <div>
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
          <div>
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

        <FadeIn delay={150} className="flex-3 flex justify-center pointer-events-none">
          <img src="/landing_level.png" alt="" className="w-full object-contain" />
        </FadeIn>
      </div>
    </section>
  );
}
