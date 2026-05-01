import type { TestConfig, TestType } from '../model/types';

const TYPE_STYLES: Record<TestType, string> = {
  'word-to-meaning': 'bg-blue-100 text-blue-700',
  'meaning-to-word': 'bg-emerald-100 text-emerald-700',
  'sentence': 'bg-violet-100 text-violet-700',
};

const TYPE_LABELS: Record<TestType, string> = {
  'word-to-meaning': 'W to M',
  'meaning-to-word': 'M to W',
  'sentence': 'Sentence',
};

export function TestConfigBadges({ config }: { config: TestConfig }) {
  return (
    <div className="flex flex-row items-center gap-1">
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-tight ${TYPE_STYLES[config.type]}`}
      >
        {TYPE_LABELS[config.type]}
      </span>
      {config.includeSynonyms && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold leading-tight bg-primary/10 text-primary">
          Syn
        </span>
      )}
    </div>
  );
}
