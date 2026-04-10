import type { TestConfig, TestType } from '../types/testConfig';

const TYPE_STYLES: Record<TestType, string> = {
  'W→EN': 'bg-blue-100 text-blue-700',
  'W→KR': 'bg-violet-100 text-violet-700',
  'M→W': 'bg-emerald-100 text-emerald-700',
};

export function TestConfigBadges({ config }: { config: TestConfig }) {
  return (
    <div className="flex flex-row items-center gap-1">
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-tight ${TYPE_STYLES[config.type]}`}
      >
        {config.type}
      </span>
      {config.includeSynonyms && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold leading-tight bg-primary/10 text-primary">
          Syn
        </span>
      )}
    </div>
  );
}
