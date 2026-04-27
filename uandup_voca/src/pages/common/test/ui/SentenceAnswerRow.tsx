interface SentenceAnswer {
  word: string;
}

interface SentenceAnswerRowProps {
  id: number;
  sentence: string;
  answer: SentenceAnswer | undefined;
  onAnswerChange: (id: number, value: string) => void;
  isLast: boolean;
}

function focusSentenceInput(id: number) {
  document.querySelector<HTMLInputElement>(`[data-sentence-row="${id}"]`)?.focus();
}

function renderSentence(sentence: string, inputValue: string, props: SentenceAnswerRowProps) {
  const { id, onAnswerChange, isLast } = props;
  const parts = sentence.split('___');

  return (
    <span className="text-sm text-on-surface leading-relaxed">
      {parts[0]}
      <input
        data-sentence-row={id}
        type="text"
        value={inputValue}
        onChange={(e) => onAnswerChange(id, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isLast) {
            e.preventDefault();
            focusSentenceInput(id + 1);
          }
        }}
        placeholder="  "
        className="inline-block w-40 border-b-2 border-outline-variant/60 bg-transparent text-[13px] text-primary font-semibold text-center placeholder:text-transparent focus:outline-none focus:border-primary transition-colors mx-1"
      />
      {parts[1]}
    </span>
  );
}

export function SentenceAnswerRow({
  id,
  sentence,
  answer,
  onAnswerChange,
  isLast,
}: SentenceAnswerRowProps) {
  const inputValue = answer?.word ?? '';
  const completed = inputValue.trim() !== '';

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
        completed
          ? 'border-primary/20 bg-primary/5'
          : 'border-outline-variant/30 bg-surface-container-low/70'
      }`}
    >
      <span className="text-[11px] font-bold text-on-surface-variant/50 w-5 shrink-0 text-center">
        {String(id).padStart(2, '0')}
      </span>

      <div className="flex-1 min-w-0">
        {renderSentence(sentence, inputValue, { id, sentence, answer, onAnswerChange, isLast })}
      </div>
    </div>
  );
}

export type { SentenceAnswer };
