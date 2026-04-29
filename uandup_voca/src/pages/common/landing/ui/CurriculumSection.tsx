import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['curriculum'];
}

export function CurriculumSection({ t }: Props) {
  return (
    <section className="min-h-155 flex items-center py-28 px-6 relative overflow-hidden">
      <div className="max-w-5xl  mx-auto w-full">
        <FadeIn>
          <div className="h-40 flex flex-col justify-center mb-5">
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
          <div className="h-16  flex flex-col justify-center">
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

      {/* 우측 이미지 */}
      <FadeIn
        delay={150}
        className="absolute right-[16%] top-[22%] flex items-center pointer-events-none"
      >
        <img src="/voca.png" alt="" className="h-44 w-auto object-contain rounded-xl shadow-lg" />
      </FadeIn>
    </section>
  );
}
