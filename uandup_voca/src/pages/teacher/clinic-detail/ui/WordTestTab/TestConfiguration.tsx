type MeaningSubType = 'en' | 'ko' | 'enKo';

interface TestConfigurationProps {
  testQty: number;
  testType: string;
  meaningSub: MeaningSubType;
  includeSynonyms: boolean;
  isEditing: boolean;
  onTestQtyChange: (v: number) => void;
  onTestTypeChange: (v: string) => void;
  onMeaningSubChange: (v: MeaningSubType) => void;
  onIncludeSynonymsChange: (v: boolean) => void;
  onEditingToggle: () => void;
}

export default function TestConfiguration({
  testQty,
  testType,
  meaningSub,
  includeSynonyms,
  isEditing,
  onTestQtyChange,
  onTestTypeChange,
  onMeaningSubChange,
  onIncludeSynonymsChange,
  onEditingToggle,
}: TestConfigurationProps) {
  return (
    <div className="bg-white border border-outline/20 rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Test Configuration
        </p>
        <button
          onClick={onEditingToggle}
          className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity"
        >
          {isEditing ? 'Apply' : 'Edit'}
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {/* Test Type */}
        <div>
          <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 block">
            Test Type
          </label>
          <select
            value={testType}
            onChange={(e) => onTestTypeChange(e.target.value)}
            disabled={!isEditing}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            <option>Word to Korean</option>
            <option>Word to English</option>
            <option>Meaning to Word</option>
          </select>
          {testType === 'Meaning to Word' && (
            <div className="mt-3 ml-4 space-y-2 border-l-2 border-primary/10 pl-4">
              {(
                [
                  { value: 'en', label: 'English to Word' },
                  { value: 'ko', label: 'Korean to Word' },
                  { value: 'enKo', label: 'En/Ko to Word' },
                ] as { value: MeaningSubType; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => isEditing && onMeaningSubChange(opt.value)}
                  className={`flex items-center gap-3 w-full ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      meaningSub === opt.value
                        ? isEditing
                          ? 'border-primary'
                          : 'border-slate-400'
                        : 'border-slate-200'
                    }`}
                  >
                    {meaningSub === opt.value && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isEditing ? 'bg-primary' : 'bg-slate-400'}`}
                      />
                    )}
                  </span>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      meaningSub === opt.value
                        ? isEditing
                          ? 'text-on-surface'
                          : 'text-slate-500'
                        : 'text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 block">
            Quantity
          </label>
          <input
            type="number"
            value={testQty}
            onChange={(e) => onTestQtyChange(Number(e.target.value))}
            disabled={!isEditing}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
          />
        </div>

        {/* Include Synonyms */}
        <div className="flex items-center justify-between py-2">
          <span className="text-xs font-semibold text-on-surface-variant">Include Synonyms</span>
          <label
            className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          >
            <input
              type="checkbox"
              checked={includeSynonyms}
              onChange={(e) => onIncludeSynonymsChange(e.target.checked)}
              disabled={!isEditing}
              className="sr-only peer"
            />
            <div className="w-8 h-5 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-error/80 font-medium text-center">
          Settings will apply to the next generated test.
        </p>
      </div>
    </div>
  );
}

export type { MeaningSubType };
