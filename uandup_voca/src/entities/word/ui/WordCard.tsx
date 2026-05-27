import type { ReactNode } from 'react';
import type { WordCardData } from '../model/types';

interface WordCardProps extends WordCardData {
  // 예문(sentence) footer 표시 여부.
  // 선생님 화면은 항상 true, 학생 화면은 study-set 응답의 exampleVisible 값을 따른다
  // (NORMAL 배정은 예문시험 채점 완료 후에만 공개).
  showSentence?: boolean;
  // 카드 외부에서 컨텍스트별로 주입하는 부가 콘텐츠(액션 버튼 / 정보 배지 등).
  // 표시 위치/스타일은 사용처가 결정한다 — 카드의 시각 책임을 단순하게 유지하기 위함.
  extraInfo?: ReactNode;
}

// 단어 1건을 표시하는 카드. 학생·선생님 화면이 공유하며, 예문 노출만 showSentence로 토글한다.
export function WordCard({
  word,
  partsOfSpeech,
  korMeaning,
  difficulty,
  engMeaning,
  synonyms,
  sentence,
  showSentence = false,
  extraInfo,
}: WordCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden border shadow-sm border-outline-variant/60 relative group">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-1/4">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold tracking-widest uppercase rounded-full">
                LEVEL {difficulty}
              </span>
            </div>
            <h2 className="font-headline font-bold text-2xl text-primary">{word}</h2>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">
                Meaning
              </h4>
              <p className="text-primary font-bold text-lg">
                <span className="text-on-tertiary-container tracking-wider mr-2">
                  {partsOfSpeech.join(' / ')}
                </span>
                {korMeaning}
              </p>
              <p className="text-on-surface-variant leading-relaxed font-body text-sm mt-1">
                {engMeaning}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">
                Synonyms
              </h4>
              <div className="flex flex-wrap gap-2">
                {synonyms.map((syn) => (
                  <span
                    key={syn}
                    className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {extraInfo && <div className="shrink-0">{extraInfo}</div>}
        </div>
      </div>

      {showSentence && (
        <div className="px-8 py-5 bg-surface-container-low border-t border-outline-variant/10">
          <div className="flex gap-3 items-baseline">
            <span className="text-md uppercase tracking-wider text-outline font-bold shrink-0">
              Sentence:
            </span>
            <p className="text-on-surface-variant text-md font-medium leading-relaxed">
              "{sentence}"
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
