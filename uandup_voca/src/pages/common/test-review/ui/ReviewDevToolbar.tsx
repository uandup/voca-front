import type { TestType } from '../../test/mock/testMockData';

interface ReviewDevToolbarProps {
  testType: TestType;
  showSynonym: boolean;
  onTestTypeChange: (type: TestType) => void;
  onShowSynonymChange: (show: boolean) => void;
}

const TYPE_LABELS: Record<TestType, string> = {
  'word-to-meaning': 'W → M',
  'meaning-to-word': 'M → W',
  sentence: 'Sentence',
};

export function ReviewDevToolbar({
  testType,
  showSynonym,
  onTestTypeChange,
  onShowSynonymChange,
}: ReviewDevToolbarProps) {
  const isVocab = testType !== 'sentence';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-on-surface/90 backdrop-blur-sm text-surface px-4 py-2.5 rounded-2xl shadow-lg">
        <span className="text-[10px] font-bold text-surface/50 uppercase tracking-widest">
          Dev
        </span>

        <div className="w-px h-4 bg-surface/20" />

        <div className="flex items-center gap-1">
          {(Object.keys(TYPE_LABELS) as TestType[]).map((type) => (
            <button
              key={type}
              onClick={() => onTestTypeChange(type)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                testType === type
                  ? 'bg-primary text-white'
                  : 'text-surface/60 hover:text-surface hover:bg-surface/10'
              }`}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        {isVocab && (
          <>
            <div className="w-px h-4 bg-surface/20" />
            <button
              onClick={() => onShowSynonymChange(!showSynonym)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                showSynonym ? 'bg-surface/15 text-surface' : 'text-surface/40 hover:text-surface/60'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                {showSynonym ? 'check_box' : 'check_box_outline_blank'}
              </span>
              Synonym
            </button>
          </>
        )}
      </div>
    </div>
  );
}
