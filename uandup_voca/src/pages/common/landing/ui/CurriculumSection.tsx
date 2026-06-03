import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['curriculum'];
}

export function CurriculumSection({ t }: Props) {
  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-12">
        {/* Top row — headline (left) + image (right), 5:5 */}
        <div className="flex items-center gap-12">
          <FadeIn className="w-1/2">
            {t.headline.lines.map((line, i) => (
              <h2
                key={i}
                className="font-headline font-extrabold text-primary leading-snug"
                style={{ fontSize: t.headline.fontSize }}
              >
                {line}
              </h2>
            ))}
          </FadeIn>

          <FadeIn delay={150} className="w-1/2 flex justify-center pointer-events-none">
            <img
              src="/voca.png"
              alt=""
              className="w-full max-w-2xl object-contain rounded-xl shadow-lg"
            />
          </FadeIn>
        </div>

        {/* Bottom row — body full width */}
        <FadeIn delay={250}>
          {t.body.lines.map((sentence, i) => (
            <p
              key={i}
              className="text-on-surface-variant leading-relaxed"
              style={{ fontSize: t.body.fontSize }}
            >
              {sentence}
            </p>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
