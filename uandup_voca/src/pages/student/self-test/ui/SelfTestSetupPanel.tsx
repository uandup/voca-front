import type { WordTestType } from '@/entities/test';
import { NumberInput } from '@/shared/ui/NumberInput';
import type { SelfTestConfig } from '../model/types';

interface Props {
  wordCount: number;
  config: SelfTestConfig;
  // 실제 시험 설정과 다른 값이 하나라도 있는지 — Reset 링크 노출 여부.
  isCustomized: boolean;
  questionCountError: string | null;
  onChange: (patch: Partial<SelfTestConfig>) => void;
  onReset: () => void;
  onStart: () => void;
  // 아래 세 개는 단어 묶음에 따라 달라지는 부분. 기본값은 StudySet 배정 단어 기준이라
  // 기존 호출부는 그대로 두면 동작이 바뀌지 않는다.
  // 어떤 단어로 연습하는지 알려주는 안내 문구.
  description?: string;
  // 동의어 개념이 있는 단어 묶음인지. 개인 단어는 단어·한글뜻뿐이라 false → 토글을 숨긴다.
  supportsSynonyms?: boolean;
  // "선생님이 정한 실제 시험 설정"이 존재하는 묶음인지. 개인 단어 세트엔 그 개념이 없어
  // false → 비교 대상이 없으므로 "Same as your real test"·Reset 행을 숨긴다.
  showRealSettingsHint?: boolean;
}

const DIRECTION_OPTIONS: { value: WordTestType; label: string }[] = [
  { value: 'word-to-meaning', label: 'Word → Meaning' },
  { value: 'meaning-to-word', label: 'Meaning → Word' },
];

// 자체 시험 시작 화면. 선생님이 정한 실제 시험 설정으로 미리 채워져 있어 Start만 누르면
// 실제 시험과 같은 형태로 출제되고, 필요하면 학생이 방향/문항 수/동의어를 바꿔 연습할 수 있다.
export function SelfTestSetupPanel({
  wordCount,
  config,
  isCustomized,
  questionCountError,
  onChange,
  onReset,
  onStart,
  description = 'Practice with your assigned words. Your answers are not saved or sent to your teacher.',
  supportsSynonyms = true,
  showRealSettingsHint = true,
}: Props) {
  return (
    <div className="w-full max-w-md bg-white border border-outline-variant/30 rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '40px' }}>
          quiz
        </span>
        <h2 className="text-xl font-bold text-on-surface">Self Test</h2>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
            Test Settings
          </span>
          {/* 비교할 "실제 시험 설정"이 있는 묶음에서만 노출한다 — 개인 단어 세트엔 그 개념이 없다. */}
          {showRealSettingsHint &&
            (isCustomized ? (
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  restart_alt
                </span>
                Reset to my test settings
              </button>
            ) : (
              <span className="text-xs font-semibold text-on-surface-variant/70">
                Same as your real test
              </span>
            ))}
        </div>

        {/* 출제 방향 */}
        <div>
          <p className="text-xs font-semibold text-on-surface-variant mb-1.5">Direction</p>
          <div className="grid grid-cols-2 gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/30">
            {DIRECTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ testType: opt.value })}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  config.testType === opt.value
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 문항 수 — 0은 빈 칸으로 보여 지우고 다시 입력할 때 "05"처럼 되지 않게 한다 */}
        <div>
          <p className="text-xs font-semibold text-on-surface-variant mb-1.5">Questions</p>
          <div className="flex items-center gap-2">
            <NumberInput
              value={config.questionCount === 0 ? '' : String(config.questionCount)}
              onChange={(v) => onChange({ questionCount: Number(v) })}
              className="w-20 text-sm border border-outline-variant/40 rounded-lg px-3 py-1.5 bg-white text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
            />
            <span className="text-sm text-on-surface-variant">/ {wordCount} words</span>
          </div>
          {questionCountError && <p className="text-xs text-error mt-1">{questionCountError}</p>}
        </div>

        {/* 동의어 포함 — TestConfigSection과 같은 토글 스타일.
            동의어가 없는 단어 묶음에선 숨긴다 — 켜도 빈 입력칸만 뜨기 때문이다. */}
        {supportsSynonyms && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-on-surface-variant">Include Synonyms</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeSynonyms}
                onChange={(e) => onChange({ includeSynonyms: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-5 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onStart}
        disabled={questionCountError !== null}
        className="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start
      </button>
    </div>
  );
}
