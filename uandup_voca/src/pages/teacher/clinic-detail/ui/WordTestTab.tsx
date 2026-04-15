import { useState } from 'react';

type WorkflowView = 'active' | 'history';
type MeaningSubType = 'en' | 'ko' | 'enKo';

const WORKFLOW_STEPS = [
  {
    key: 'word',
    label: 'Word',
    status: 'done',
    date: 'Oct 20 • 49/50',
    subLabel: 'Word to Korean',
  },
  { key: 'example', label: 'Example', status: 'active' },
  { key: 'review1', label: 'Review 1', status: 'locked' },
  { key: 'review2', label: 'Review 2', status: 'locked' },
  { key: 'review3', label: 'Review 3', status: 'locked' },
] as const;

export function WordTestTab() {
  const [workflowView, setWorkflowView] = useState<WorkflowView>('active');
  const [testQty, setTestQty] = useState(30);
  const [testType, setTestType] = useState('Meaning to Word');
  const [meaningSub, setMeaningSub] = useState<MeaningSubType>('en');
  const [includeSynonyms, setIncludeSynonyms] = useState(true);
  const [isConfigEditing, setIsConfigEditing] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Workflow Area */}
      <div className="col-span-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-headline font-bold text-primary uppercase tracking-wide">
            Active Workflow
          </h3>
          <div className="flex gap-1 p-1 bg-slate-100/50 rounded-lg">
            {(['active', 'history'] as WorkflowView[]).map((v) => (
              <button
                key={v}
                onClick={() => setWorkflowView(v)}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors capitalize ${
                  workflowView === v
                    ? 'bg-white text-primary shadow-sm'
                    : 'font-medium text-on-surface-variant hover:bg-white/50'
                }`}
              >
                {v === 'active' ? 'Active' : 'History'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-outline/20 rounded-2xl p-10 flex flex-col items-center">
          <div className="mb-10 text-center">
            <div className="flex flex-col items-center gap-1">
              <h4 className="text-xl font-headline font-bold text-primary">
                Academic Vocabulary #48-97
              </h4>
              <div className="flex gap-2 items-center text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                <span>Level 4</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>Qty: 50</span>
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="flex items-start justify-center w-full max-w-2xl">
            {WORKFLOW_STEPS.map((step, idx) => (
              <div key={step.key} className="flex items-start">
                <div className="flex-1 flex flex-col items-center min-w-18">
                  {step.status === 'done' && (
                    <div className="w-12 h-12 rounded-full border-2 border-success bg-success/5 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-success">check</span>
                    </div>
                  )}
                  {step.status === 'active' && (
                    <div className="w-12 h-12 rounded-full border-2 border-primary bg-primary flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
                      <span className="material-symbols-outlined text-white">description</span>
                    </div>
                  )}
                  {step.status === 'locked' && (
                    <div className="w-12 h-12 rounded-full border border-outline/20 bg-slate-50 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-slate-300 text-sm">lock</span>
                    </div>
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      step.status === 'done'
                        ? 'text-success'
                        : step.status === 'active'
                          ? 'text-primary'
                          : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.status === 'done' && 'date' in step && (
                    <div className="mt-1 flex flex-col items-center text-center">
                      <span className="text-[9px] text-on-surface-variant font-bold">
                        {step.date}
                      </span>
                      <span className="text-[8px] text-on-surface-variant opacity-70">
                        {step.subLabel}
                      </span>
                    </div>
                  )}
                  {step.status === 'active' && (
                    <span className="text-[9px] text-primary font-bold">Ready</span>
                  )}
                </div>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mt-6 ${
                      step.status === 'done' ? 'bg-success' : 'bg-slate-100'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button className="bg-primary hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide shadow-xl shadow-primary/10 flex items-center gap-2 transition-opacity">
              Generate Example Test
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Configuration Sidebar */}
      <div className="col-span-4 flex flex-col space-y-4">
        <h3 className="text-sm font-headline font-bold text-primary uppercase tracking-wide opacity-0">
          Configuration
        </h3>
        <div className="bg-white border border-outline/20 rounded-2xl p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Test Configuration
            </p>
            <button
              onClick={() => setIsConfigEditing((v) => !v)}
              className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 transition-opacity"
            >
              {isConfigEditing ? 'Apply' : 'Edit'}
            </button>
          </div>
          <div className="space-y-6 flex-1">
            <div>
              <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 block">
                Test Type
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                disabled={!isConfigEditing}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
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
                      onClick={() => isConfigEditing && setMeaningSub(opt.value)}
                      className={`flex items-center gap-3 w-full ${isConfigEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                      {/* 커스텀 라디오 */}
                      <span
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          meaningSub === opt.value
                            ? isConfigEditing
                              ? 'border-primary'
                              : 'border-slate-400'
                            : 'border-slate-200'
                        }`}
                      >
                        {meaningSub === opt.value && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isConfigEditing ? 'bg-primary' : 'bg-slate-400'}`}
                          />
                        )}
                      </span>
                      <span
                        className={`text-xs font-medium transition-colors ${
                          meaningSub === opt.value
                            ? isConfigEditing
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
            <div>
              <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 block">
                Quantity
              </label>
              <input
                type="number"
                value={testQty}
                onChange={(e) => setTestQty(Number(e.target.value))}
                disabled={!isConfigEditing}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-semibold text-on-surface-variant">
                Include Synonyms
              </span>
              <label
                className={`relative inline-flex items-center ${isConfigEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              >
                <input
                  type="checkbox"
                  checked={includeSynonyms}
                  onChange={(e) => setIncludeSynonyms(e.target.checked)}
                  disabled={!isConfigEditing}
                  className="sr-only peer"
                />
                <div className="w-8 h-5 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-on-surface-variant/80 font-medium text-center">
              Settings will apply to the next generated test.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
