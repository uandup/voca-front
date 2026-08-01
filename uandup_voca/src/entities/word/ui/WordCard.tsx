import { useEffect, useState, type ReactNode } from 'react';
import type { WordCardData } from '../model/types';

interface WordCardProps extends WordCardData {
  // 예문(sentence) footer 표시 여부.
  // 선생님 화면은 항상 true, 학생 화면은 study-set 응답의 exampleVisible 값을 따른다
  // (NORMAL 배정은 예문시험 채점 완료 후에만 공개).
  showSentence?: boolean;
  // 카드 외부에서 컨텍스트별로 주입하는 부가 콘텐츠(액션 버튼 / 정보 배지 등).
  // 표시 위치/스타일은 사용처가 결정한다 — 카드의 시각 책임을 단순하게 유지하기 위함.
  extraInfo?: ReactNode;
  // 단어를 가린다 — 학생이 뜻·예문을 보고 단어를 떠올리는 용도.
  // 기본 false라 선생님 조회 화면들은 그대로 동작한다.
  hideWord?: boolean;
  // 뜻 묶음(품사·한글뜻·영영뜻·동의어·예문)을 가린다 — 단어를 보고 뜻을 떠올리는 용도.
  // 예문은 정답 자리가 이미 '______'라 단어를 흘리지 않지만 문맥으로 뜻은 흘리므로 이쪽에 포함한다.
  hideMeaning?: boolean;
}

// SAT 중요도(0~3). 채워진 별은 amber, 빈 별은 outline/25. 0이면 빈 별 3개.
function SatStars({ priority }: { priority: number }) {
  return (
    <div className="flex items-center gap-0.5 mt-1.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={
            i < priority
              ? 'material-symbols-outlined text-amber-400'
              : 'material-symbols-outlined text-outline/25'
          }
          style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

// 가릴 수 있는 영역. 클릭하면 그 카드만 공개되고, 다시 클릭하면 도로 가려진다.
//
// 내용을 빼고 바로 치환하는 대신 **자리는 그대로 두고 visibility로 감춘 뒤 위를 덮는다.**
// 가림/공개 사이에 영역 크기가 변하지 않아야 공개할 때 카드 높이가 바뀌지 않고,
// 목록에서 한 장을 열 때 아래 카드들이 밀리지 않는다.
//
// visibility:hidden이라 감춰진 동안에는 드래그 선택·탭 포커스·스크린리더에도 잡히지 않는다
// (DOM에는 남아 있으므로 개발자도구로는 볼 수 있지만, 학습 보조 기능이라 그 수준으로 충분하다).
function Maskable({
  hidden,
  // 마스크 토글이 켜져 있는가. 공개 상태에서도 다시 눌러 가릴 수 있게 클릭 영역을 유지한다.
  enabled,
  label,
  onClick,
  children,
}: {
  hidden: boolean;
  enabled: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <div className={hidden ? 'invisible' : ''}>{children}</div>
      {enabled && (
        <button
          onClick={onClick}
          aria-label={label}
          className={`absolute inset-0 rounded-lg transition-colors ${
            hidden ? 'bg-surface-container-highest hover:bg-surface-container-high' : ''
          }`}
        />
      )}
    </div>
  );
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
  satPriority,
  examTags,
  showSentence = false,
  extraInfo,
  hideWord = false,
  hideMeaning = false,
}: WordCardProps) {
  // 카드별 공개 상태. 툴바 토글은 목록 전체를 가리고, 이 상태는 카드 하나만 되돌린다.
  const [revealedWord, setRevealedWord] = useState(false);
  const [revealedMeaning, setRevealedMeaning] = useState(false);

  // 토글을 껐다 다시 켰을 때 이전에 공개해둔 카드가 열린 채로 남지 않도록 리셋한다.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRevealedWord(false);
  }, [hideWord]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRevealedMeaning(false);
  }, [hideMeaning]);

  const wordMasked = hideWord && !revealedWord;
  const meaningMasked = hideMeaning && !revealedMeaning;

  const wordHeading = <h2 className="font-headline font-bold text-2xl text-primary">{word}</h2>;

  const meaningBlocks = (
    <>
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">Meaning</h4>
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
    </>
  );

  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden border shadow-sm border-outline-variant/60 relative group">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-1/4">
            {/* LEVEL·별점·기출 태그는 정답이 아니므로 가리기와 무관하게 항상 노출한다. */}
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold tracking-widest uppercase rounded-full">
                LEVEL {difficulty}
              </span>
            </div>
            <Maskable
              hidden={wordMasked}
              enabled={hideWord}
              label={wordMasked ? 'Show word' : 'Hide word again'}
              onClick={() => setRevealedWord(!revealedWord)}
            >
              {wordHeading}
            </Maskable>
            {/* SAT 중요도 별표 */}
            <SatStars priority={satPriority} />
            {/* 기출 태그 */}
            {examTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {examTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-surface-container-highest text-outline text-[11px] font-bold rounded-full tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Maskable
              hidden={meaningMasked}
              enabled={hideMeaning}
              label={meaningMasked ? 'Show meaning' : 'Hide meaning again'}
              onClick={() => setRevealedMeaning(!revealedMeaning)}
            >
              {/* space-y-4가 Maskable 안으로 들어와야 두 블록 사이 간격이 유지된다. */}
              <div className="space-y-4">{meaningBlocks}</div>
            </Maskable>
          </div>

          {extraInfo && <div className="shrink-0 self-start">{extraInfo}</div>}
        </div>
      </div>

      {/* 예문은 뜻 묶음의 일부라 뜻과 같은 공개 상태를 공유한다.
          footer를 통째로 없애지 않고 자리를 남긴 채 덮어야 공개 시 카드 높이가 안 변한다. */}
      {showSentence && sentence && (
        <div className="px-8 py-5 bg-surface-container-low border-t border-outline-variant/10">
          <Maskable
            hidden={meaningMasked}
            enabled={hideMeaning}
            label={meaningMasked ? 'Show sentence' : 'Hide sentence again'}
            onClick={() => setRevealedMeaning(!revealedMeaning)}
          >
            <div className="flex gap-3 items-baseline">
              <span className="text-md uppercase tracking-wider text-outline font-bold shrink-0">
                Sentence:
              </span>
              <p className="text-on-surface-variant text-md font-medium leading-relaxed">
                "{sentence}"
              </p>
            </div>
          </Maskable>
        </div>
      )}
    </article>
  );
}
