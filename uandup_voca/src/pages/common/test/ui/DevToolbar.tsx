import type { TestType } from '../mock/testMockData';

const TEST_TYPE_LABELS: Record<TestType, string> = {
  'word-to-meaning': 'W → M',
  'meaning-to-word': 'M → W',
  sentence: 'Sentence',
};

interface DevToolbarProps {
  testType: TestType;
  showSynonym: boolean;
  onTestTypeChange: (type: TestType) => void;
  onShowSynonymChange: (show: boolean) => void;
}

export function DevToolbar({
  testType,
  showSynonym,
  onTestTypeChange,
  onShowSynonymChange,
}: DevToolbarProps) {
  const isVocabType = testType !== 'sentence';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-on-surface/90 text-surface backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold">
      <span className="text-surface/50 uppercase tracking-widest text-[10px]">Dev</span>
      <div className="w-px h-4 bg-surface/20" />

      {/* Test Type */}
      <span className="text-surface/70">Type</span>
      <div className="flex items-center gap-1">
        {(Object.keys(TEST_TYPE_LABELS) as TestType[]).map((type) => (
          <button
            key={type}
            onClick={() => onTestTypeChange(type)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              testType === type
                ? 'bg-primary text-white'
                : 'bg-surface/10 text-surface/60 hover:bg-surface/20'
            }`}
          >
            {TEST_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Synonym toggle — sentence 모드에서는 비활성화 */}
      {isVocabType && (
        <>
          <div className="w-px h-4 bg-surface/20" />
          <span className="text-surface/70">Synonym</span>
          <button
            onClick={() => onShowSynonymChange(!showSynonym)}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              showSynonym ? 'bg-primary' : 'bg-surface/20'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                showSynonym ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </>
      )}
    </div>
  );
}
