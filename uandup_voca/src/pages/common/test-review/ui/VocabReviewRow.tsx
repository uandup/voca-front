import type { VocabTestType } from '../../test/mock/testMockData';
import type { Answer } from '../../test/ui/VocabAnswerRow';

interface VocabReviewRowProps {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
  synonymAnswer: string;
  testType: VocabTestType;
  showSynonym: boolean;
  answer: Answer | undefined;
  isWrong: boolean;
  readOnly?: boolean;
  hideCheckbox?: boolean;
  onToggleWrong: (id: number) => void;
}

export function VocabReviewRow({
  id,
  word,
  korMeaning,
  engMeaning,
  synonymAnswer,
  testType,
  showSynonym,
  answer,
  isWrong,
  readOnly = false,
  hideCheckbox = false,
  onToggleWrong,
}: VocabReviewRowProps) {
  const studentMeaning = answer?.meaning ?? '';
  const studentSynonym = answer?.synonym ?? '';
  const isWordToMeaning = testType === 'word-to-meaning';

  const containerBorder = isWrong ? 'border-error/20' : 'border-outline-variant/30';
  const answerRowBg = isWrong ? 'bg-error/5' : 'bg-surface-container-low/70';
  const correctRowBg = isWrong ? 'bg-error/5' : 'bg-surface-container-low/30';
  const dividerColor = isWrong ? 'border-error/10' : 'border-outline-variant/20';
  const answerColor =
    studentMeaning.trim() === ''
      ? 'text-on-surface-variant/30 italic'
      : isWrong
        ? 'text-error'
        : 'text-on-surface';
  const synonymColor =
    studentSynonym.trim() === ''
      ? 'text-on-surface-variant/30 italic'
      : isWrong
        ? 'text-error'
        : 'text-on-surface';

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${containerBorder}`}>
      {/* Student answer row */}
      <div className={`flex items-center gap-3 px-4 py-3 ${answerRowBg}`}>
        {/* Number */}
        <span className="text-[11px] font-bold text-on-surface-variant/50 w-5 shrink-0 text-center">
          {String(id).padStart(2, '0')}
        </span>

        {/* Word column: word label (W→M) / student answer word (M→W) */}
        {isWordToMeaning ? (
          <span className="text-sm font-bold w-40 shrink-0 truncate text-on-surface">{word}</span>
        ) : (
          <p className={`w-40 shrink-0 text-sm font-bold wrap-break-word ${answerColor}`}>
            {studentMeaning.trim() === '' ? 'No answer' : studentMeaning}
          </p>
        )}

        {/* Meaning column: student answer meaning (W→M) / kor+eng meaning label (M→W) */}
        {isWordToMeaning ? (
          <p className={`flex-1 min-w-0 text-xs font-semibold wrap-break-word ${answerColor}`}>
            {studentMeaning.trim() === '' ? 'No answer' : studentMeaning}
          </p>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-on-surface leading-tight">{korMeaning}</p>
            <p className="text-xs text-on-surface-variant/60 leading-tight line-clamp-2 mt-1">
              {engMeaning}
            </p>
          </div>
        )}

        {/* Synonym column: student synonym */}
        {showSynonym && (
          <p className={`w-40 shrink-0 text-xs leading-snug wrap-break-word ${synonymColor}`}>
            {studentSynonym.trim() === '' ? 'No synonym' : studentSynonym}
          </p>
        )}

        {/* Wrong check button */}
        {!hideCheckbox && (
          <div
            onClick={readOnly ? undefined : () => onToggleWrong(id)}
            role={readOnly ? undefined : 'button'}
            className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border-2 transition-colors ${
              isWrong
                ? 'bg-error border-error text-white'
                : 'border-outline-variant/40 text-transparent'
            } ${readOnly ? 'cursor-default' : 'cursor-pointer hover:border-error/40 hover:text-error/30'}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              close
            </span>
          </div>
        )}
      </div>

      {/* Correct answer row */}
      <div className={`flex items-center gap-3 px-4 py-2 border-t ${dividerColor} ${correctRowBg}`}>
        {/* Number placeholder */}
        <span className="w-5 shrink-0" />

        {/* Word column: empty (W→M) / correct word (M→W) */}
        {isWordToMeaning ? (
          <span className="w-40 shrink-0" />
        ) : (
          <p className="w-40 shrink-0 text-xs font-semibold text-primary/80">{word}</p>
        )}

        {/* Meaning column: kor+eng correct meaning (W→M) / empty (M→W) */}
        {isWordToMeaning ? (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary/80 leading-tight">{korMeaning}</p>
            <p className="text-xs text-on-surface-variant/60 leading-tight line-clamp-2 mt-1">
              {engMeaning}
            </p>
          </div>
        ) : (
          <span className="flex-1 min-w-0" />
        )}

        {/* Synonym column: correct synonym (both types) */}
        {showSynonym && (
          <p className="w-40 shrink-0 text-[11px] text-primary/60 leading-snug wrap-break-word">
            {synonymAnswer}
          </p>
        )}

        {/* Check button placeholder */}
        {!hideCheckbox && <span className="w-8 shrink-0" />}
      </div>
    </div>
  );
}
