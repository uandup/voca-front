import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['wrongWord'];
}

export function WrongWordSection({ t }: Props) {
  return (
    <section className="min-h-140 flex items-center py-28 px-6">
      <div className="max-w-5xl mx-auto w-full flex items-center gap-16">
        <FadeIn delay={150} className="flex-1 flex justify-center pointer-events-none">
          <img
            src="/wrong_word_bank.png"
            alt=""
            className="w-full max-w-lg object-contain rounded-xl shadow-xl"
          />
        </FadeIn>

        <FadeIn className="flex-1 flex flex-col gap-5">
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
      </div>
    </section>
  );
}
