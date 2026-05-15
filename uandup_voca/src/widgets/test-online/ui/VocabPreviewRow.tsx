// 선생님 Preview 화면에서 사용하는 단일 행 — 학생 답 영역 없이 word/뜻/synonym만 표시.
// VocabAnswerRow의 input 중심 구조나 VocabReviewRow의 2행 비교 구조와 의도가 달라 별도 컴포넌트로 분리.

interface VocabPreviewRowProps {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
  synonymAnswer: string;
  showSynonym: boolean;
}

export function VocabPreviewRow({
  id,
  word,
  korMeaning,
  engMeaning,
  synonymAnswer,
  showSynonym,
}: VocabPreviewRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/40">
      <span className="text-[11px] font-bold text-on-surface-variant/50 w-5 shrink-0 text-center">
        {String(id).padStart(2, '0')}
      </span>

      <span className="text-sm font-bold w-40 shrink-0 truncate text-on-surface">{word}</span>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-on-surface leading-tight">{korMeaning}</p>
        <p className="text-xs text-on-surface-variant/60 leading-tight line-clamp-2 mt-1">
          {engMeaning}
        </p>
      </div>

      {showSynonym && (
        <p className="w-40 shrink-0 text-xs text-on-surface-variant leading-snug wrap-break-word">
          {synonymAnswer}
        </p>
      )}
    </div>
  );
}
