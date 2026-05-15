// 선생님 Preview 화면에서 사용하는 sentence 시험용 단일 행.
// 학생이 풀 화면(SentenceAnswerRow)의 input 자리에 정답 word를 채워서 보여준다.

interface SentencePreviewRowProps {
  id: number;
  sentence: string; // "___" 자리 표시자가 포함된 원문
  answer: string; // 빈칸을 채울 정답 단어
}

export function SentencePreviewRow({ id, sentence, answer }: SentencePreviewRowProps) {
  const parts = sentence.split('_____');

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/40">
      <span className="text-[11px] font-bold text-on-surface-variant/50 w-5 shrink-0 text-center">
        {String(id).padStart(2, '0')}
      </span>

      <div className="flex-1 min-w-0">
        <span className="text-sm text-on-surface leading-relaxed">
          {parts[0]}
          <span className="font-bold text-primary mx-1">{answer}</span>
          {parts[1]}
        </span>
      </div>
    </div>
  );
}
