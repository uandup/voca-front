import type { ReactNode } from 'react';
import type { TeacherWord } from '../model/types';

interface TeacherWordCardProps extends TeacherWord {
  // 카드 외부에서 컨텍스트별로 주입하는 부가 콘텐츠.
  // 표시 위치/스타일(액션 버튼 그룹 / 정보 배지 등)은 사용처가 결정한다.
  // StudentWordCard와 동일한 슬롯 시그니처 — onEdit/onDelete 같은 특정 액션을 prop으로
  // 분리하지 않는 이유는 카드의 *시각 책임*을 단순하게 유지하기 위함.
  extraInfo?: ReactNode;
}

export function TeacherWordCard({
  word,
  partsOfSpeech,
  korMeaning,
  difficulty,
  engMeaning,
  synonyms,
  sentence,
  extraInfo,
}: TeacherWordCardProps) {
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
    </article>
  );
}
