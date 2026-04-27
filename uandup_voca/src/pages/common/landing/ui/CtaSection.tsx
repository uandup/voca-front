import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['cta'];
}

export function CtaSection({ t }: Props) {
  return (
    <section className="min-h-80 flex items-center py-28 px-6 primary-gradient relative overflow-hidden">
      <FadeIn className="max-w-2xl mx-auto text-center relative w-full">
        {/* 헤드라인: 2줄 고정 */}
        <div className="h-20 flex flex-col items-center justify-center mb-5">
          {t.headline.lines.map((line, i) => (
            <h2
              key={i}
              className="font-headline font-extrabold text-on-primary leading-tight"
              style={{ fontSize: t.headline.fontSize }}
            >
              {line}
            </h2>
          ))}
        </div>
        {/* 본문: 단일 문장, 고정 높이 */}
        <div className="h-12 flex items-center justify-center mb-10">
          <p
            className="text-on-primary/70 leading-relaxed max-w-xl mx-auto"
            style={{ fontSize: t.headline.bodyFontSize }}
          >
            {t.body}
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
