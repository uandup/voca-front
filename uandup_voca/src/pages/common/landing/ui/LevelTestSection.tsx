import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['levelTest'];
}

export function LevelTestSection({ t }: Props) {
  return (
    <section className="min-h-120 flex items-center py-28 px-6 bg-surface-container-low border-none">
      <div className="max-w-5xl mx-auto w-full">
        <FadeIn>
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
      </div>
    </section>
  );
}
