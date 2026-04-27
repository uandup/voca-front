import { FadeIn } from './FadeIn';
import type { LandingContent } from '../model/landingContent';

const WRONG_WORDS = [
  { word: 'meticulous', count: 5 },
  { word: 'ephemeral', count: 3 },
  { word: 'anachronism', count: 7 },
  { word: 'perfidious', count: 2 },
];

interface Props {
  t: LandingContent['wrongWord'];
}

export function WrongWordSection({ t }: Props) {
  return (
    <section className="min-h-150 flex items-center py-28 px-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row-reverse gap-14 items-center w-full">
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
            {t.body.lines.map((sentence, i) => (
              <p key={i} className="text-on-surface-variant leading-relaxed" style={{ fontSize: t.body.fontSize }}>
                {sentence}
              </p>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={150} className="flex-1 max-w-sm w-full">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant premium-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-on-surface text-sm">{t.cardTitle}</span>
              <span className="text-xs font-semibold text-error bg-error-container px-2.5 py-0.5 rounded-full">
                {t.cardCount}
              </span>
            </div>
            <div className="space-y-0">
              {WRONG_WORDS.map((item, idx) => (
                <div
                  key={item.word}
                  className="flex items-center justify-between py-2.5 border-b border-outline-variant last:border-0 opacity-0 animate-[fadeUp_0.4s_ease_forwards]"
                  style={{ animationDelay: `${idx * 80 + 200}ms` }}
                >
                  <span className="text-on-surface text-sm font-medium">{item.word}</span>
                  <span className="text-xs font-semibold text-error bg-error-container/50 px-2 py-0.5 rounded-full">
                    ✗ {item.count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
