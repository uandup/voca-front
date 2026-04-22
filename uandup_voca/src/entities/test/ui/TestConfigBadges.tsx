import type { TestConfig, TestType } from '../types/testConfig';

const TYPE_STYLES: Record<TestType, string> = {
  'Word to Meaning': 'bg-blue-100 text-blue-700',
  'Meaning to Word': 'bg-emerald-100 text-emerald-700',
};

const TYPE_LABELS: Record<TestType, string> = {
  'Word to Meaning': 'W to M',
  'Meaning to Word': 'M to W',
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
