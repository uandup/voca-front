import type { LandingContent } from '../model/landingContent';

interface Props {
  t: LandingContent['hero'];
}

export function HeroSection({ t }: Props) {
  return (
    <section className="h-145 pt-20 flex items-center justify-center px-6 text-center primary-gradient relative overflow-hidden">
      <div className="max-w-5xl w-full relative flex flex-col items-center">
        {/* 헤드라인: 줄 수 고정 + clamp로 폰트 자동 조절 */}
        <div className="h-40 flex flex-col items-center justify-center opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.3s_forwards]">
          {t.headline.lines.map((line, i) => (
            <h1
              key={i}
              className={`font-headline font-extrabold leading-tight w-full text-center ${i === 0 ? 'text-on-primary' : 'text-on-primary/60'}`}
              style={{ fontSize: t.headline.fontSize, wordBreak: 'keep-all' }}
            >
              {line}
            </h1>
          ))}
        </div>

        {/* 서브카피: 고정 높이 박스 */}
        <div className="h-28 flex flex-col items-center justify-center mb-10 opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.5s_forwards]">
          {t.sub.map((line, i) => (
            <p
              key={i}
              className="text-on-primary/70 leading-relaxed max-w-6xl"
              style={{ fontSize: t.headline.subFontSize }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
