import { EXAM_BADGES } from '../model/constants';

export function OnboardingHero() {
  return (
    <div className="pl-60 hidden lg:flex flex-1 w-1/2 flex-col items-center justify-center relative">
      <div className="flex flex-col items-center text-center max-w-lg">
        <div className="flex flex-col items-center justify-center mb-6 opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.3s_forwards]">
          <h1
            className="font-headline font-extrabold leading-tight text-on-primary"
            style={{ fontSize: '2.75rem', wordBreak: 'keep-all' }}
          >
            The Most Systematic Vocabulary Solution
          </h1>
          <h1
            className="font-headline font-extrabold leading-tight text-on-primary/60"
            style={{ fontSize: '2.5rem', wordBreak: 'keep-all' }}
          >
            Powered by
          </h1>
          <h1
            className="font-headline font-extrabold leading-tight text-on-primary/60"
            style={{ fontSize: '2.5rem', wordBreak: 'keep-all' }}
          >
            Individual Learning Data.
          </h1>
        </div>

        <p
          className="text-on-primary/70 leading-relaxed opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.5s_forwards]"
          style={{ fontSize: '1.125rem' }}
        >
          From progress monitoring to structured review,
        </p>
        <p
          className="text-on-primary/70 leading-relaxed mb-8 opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.5s_forwards]"
          style={{ fontSize: '1.125rem' }}
        >
          every step is precisely managed through our online system.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.7s_forwards]">
          {EXAM_BADGES.map((badge) => (
            <span
              key={badge}
              className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white/10 text-on-primary/80 border border-white/20"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
