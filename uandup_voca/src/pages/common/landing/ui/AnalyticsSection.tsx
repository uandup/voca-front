import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['analytics'];
}

export function AnalyticsSection({ t }: Props) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* 헤드라인 */}
        <FadeIn className="text-center">
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

        {/* 이미지 */}
        <FadeIn delay={100} className="flex justify-center pointer-events-none">
          <img
            src="/dashboard.png"
            alt=""
            className="w-full object-contain rounded-2xl shadow-xl border border-outline-variant/40"
          />
        </FadeIn>

        {/* body */}
        <FadeIn delay={150} className="text-center">
          <div className="max-w-5xl mx-auto">
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
