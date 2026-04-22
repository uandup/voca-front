interface Answer {
  primaryMeaning: string;
  synonym: string;
}

interface VocabAnswerRowProps {
  id: number;
  word: string;
  answer: Answer | undefined;
  onAnswerChange: (id: number, field: keyof Answer, value: string) => void;
}

export function VocabAnswerRow({ id, word, answer, onAnswerChange }: VocabAnswerRowProps) {
  const completed =
    (answer?.primaryMeaning ?? '').trim() !== '' && (answer?.synonym ?? '').trim() !== '';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
        completed
          ? 'border-primary/20 bg-primary/5'
          : 'border-outline-variant/30 bg-surface-container-low/70'
      }`}
    >
      <span className="text-[11px] font-bold text-on-surface-variant/50 w-5 shrink-0 text-center">
        {String(id).padStart(2, '0')}
      </span>

      <span
        className={`text-sm font-bold w-32 shrink-0 truncate ${
          completed ? 'text-primary' : 'text-on-surface'
        }`}
      >
        {word}
      </span>

      <input
        type="text"
        value={answer?.primaryMeaning ?? ''}
        onChange={(e) => onAnswerChange(id, 'primaryMeaning', e.target.value)}
        placeholder="meaning"
        className="flex-1 min-w-0 bg-transparent border border-outline-variant/40 rounded-lg px-3 py-1 text- text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
      />

      <input
        type="text"
        value={answer?.synonym ?? ''}
        onChange={(e) => onAnswerChange(id, 'synonym', e.target.value)}
        placeholder="Synonyms"
        className="w-40 bg-transparent border border-outline-variant/40 rounded-lg px-3 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );
}

export type { Answer };
