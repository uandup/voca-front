interface SentenceReviewRowProps {
  id: number;
  sentence: string;
  answerWord: string;
  studentWord: string;
  isWrong: boolean;
  onToggleWrong: (id: number) => void;
}

function renderSentenceWithReview(
  sentence: string,
  studentWord: string,
  answerWord: string,
  isWrong: boolean,
) {
  const parts = sentence.split('___');
  const isEmpty = studentWord.trim() === '';

  return (
    <span className="text-sm text-on-surface leading-relaxed">
      {parts[0]}
      <span className="inline-flex items-baseline gap-0.5 mx-1 border-b-2 border-outline-variant/50 px-1">
        <span className={`font-semibold text-[13px] ${isWrong ? 'text-error' : 'text-primary'}`}>
          {isEmpty ? '—' : studentWord}
        </span>
        <span className="text-on-surface-variant/40 text-[11px]">/</span>
        <span className="text-[12px] font-medium text-primary/60">{answerWord}</span>
      </span>
      {parts[1]}
    </span>
  );
}

export function SentenceReviewRow({
  id,
  sentence,
  answerWord,
  studentWord,
  isWrong,
  onToggleWrong,
}: SentenceReviewRowProps) {
  const containerBg = isWrong
    ? 'border-error/20 bg-error/5'
    : 'border-outline-variant/30 bg-surface-container-low/70';

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${containerBg}`}>
      <span className="text-[11px] font-bold text-on-surface-variant/50 w-5 shrink-0 text-center">
        {String(id).padStart(2, '0')}
      </span>

      <div className="flex-1 min-w-0">
        {renderSentenceWithReview(sentence, studentWord, answerWord, isWrong)}
      </div>

      <button
        onClick={() => onToggleWrong(id)}
        className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border-2 transition-colors ${
          isWrong
            ? 'bg-error border-error text-white'
            : 'border-outline-variant/40 text-transparent hover:border-error/40 hover:text-error/30'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
          close
        </span>
      </button>
    </div>
  );
}
