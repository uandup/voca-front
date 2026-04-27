import type { TestType } from '../mock/testMockData';

interface Answer {
  meaning: string;
  synonym: string;
}

interface VocabAnswerRowProps {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
  testType: TestType;
  showSynonym: boolean;
  answer: Answer | undefined;
  onAnswerChange: (id: number, field: keyof Answer, value: string) => void;
  isLast: boolean;
}

function focusInput(id: number, field: keyof Answer) {
  document.querySelector<HTMLInputElement>(`[data-row="${id}"][data-field="${field}"]`)?.focus();
}

export function VocabAnswerRow({
  id,
  word,
  korMeaning,
  engMeaning,
  testType,
  showSynonym,
  answer,
  onAnswerChange,
  isLast,
}: VocabAnswerRowProps) {
  const meaningFilled = (answer?.meaning ?? '').trim() !== '';
  const synonymFilled = (answer?.synonym ?? '').trim() !== '';
  const completed = showSynonym ? meaningFilled && synonymFilled : meaningFilled;

  const handleMeaningKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (showSynonym) {
      focusInput(id, 'synonym');
    } else if (!isLast) {
      focusInput(id + 1, 'meaning');
    }
  };

  const handleSynonymKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLast) {
      e.preventDefault();
      focusInput(id + 1, 'meaning');
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
        completed
          ? 'border-primary/20 bg-primary/5'
          : 'border-outline-variant/30 bg-surface-container-low/70'
      }`}
    >
      {/* Number */}
      <span className="text-[11px] font-bold text-on-surface-variant/50 w-5 shrink-0 text-center">
        {String(id).padStart(2, '0')}
      </span>

      {/* Word 위치 — word-to-meaning: 단어 표시 / meaning-to-word: 단어 입력 */}
      {testType === 'word-to-meaning' ? (
        <span
          className={`text-sm font-bold w-40 shrink-0 truncate ${
            completed ? 'text-primary' : 'text-on-surface'
          }`}
        >
          {word}
        </span>
      ) : (
        <input
          data-row={id}
          data-field="meaning"
          type="text"
          value={answer?.meaning ?? ''}
          onChange={(e) => onAnswerChange(id, 'meaning', e.target.value)}
          onKeyDown={handleMeaningKeyDown}
          placeholder="Word"
          className="w-40 shrink-0 bg-transparent border border-outline-variant/40 rounded-lg px-3 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
      )}

      {/* Meaning 위치 — word-to-meaning: 뜻 입력 / meaning-to-word: 한글/영어 뜻 표시 */}
      {testType === 'word-to-meaning' ? (
        <input
          data-row={id}
          data-field="meaning"
          type="text"
          value={answer?.meaning ?? ''}
          onChange={(e) => onAnswerChange(id, 'meaning', e.target.value)}
          onKeyDown={handleMeaningKeyDown}
          placeholder="Meaning"
          className="flex-1 min-w-0 bg-transparent border border-outline-variant/40 rounded-lg px-3 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
      ) : (
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-on-surface leading-tight">{korMeaning}</p>
          <p className="text-xs text-on-surface-variant/70 leading-tight line-clamp-2 mt-1">
            {engMeaning}
          </p>
        </div>
      )}

      {/* Synonym input (optional) */}
      {showSynonym && (
        <input
          data-row={id}
          data-field="synonym"
          type="text"
          value={answer?.synonym ?? ''}
          onChange={(e) => onAnswerChange(id, 'synonym', e.target.value)}
          onKeyDown={handleSynonymKeyDown}
          placeholder="Synonyms"
          className="w-40 bg-transparent border border-outline-variant/40 rounded-lg px-3 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
      )}
    </div>
  );
}

export type { Answer };
