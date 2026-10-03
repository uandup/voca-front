import { useEffect, useState, type ReactNode } from 'react';
import { Maskable } from '@/shared/ui/Maskable';
import type { MobileWordItem } from '../model/types';

interface Props {
  item: MobileWordItem;
  // 예문 표시 여부. 배정 단어는 서버의 exampleVisible을 따르고, 오답 단어는 항상 true.
  showSentence?: boolean;
  // 카드 우상단에 들어가는 부가 콘텐츠(북마크 버튼 등). 위치는 카드가, 내용은 사용처가 정한다.
  extraInfo?: ReactNode;
  hideWord?: boolean;
  hideMeaning?: boolean;
}

// SAT 중요도(0~3). 데스크탑 WordCard와 달리 값이 없으면 아예 그리지 않는다.
function SatStars({ priority }: { priority: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={
            i < priority
              ? 'material-symbols-outlined text-amber-400'
              : 'material-symbols-outlined text-outline/25'
          }
          style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

/**
 * 폰 폭(360~430px)에 맞춘 단어 카드.
 *
 * 데스크탑 entities/word의 WordCard를 고치지 않고 따로 만든 이유:
 * WordCard는 `flex-col lg:flex-row`인데 왼쪽 컬럼이 `w-1/4` 고정이라 세로로 쌓여도 폭 25%를
 * 유지한다. 이걸 고치려면 데스크탑 768~1023px 렌더가 바뀌고, WordCard는 학생·선생님 페이지가
 * 모두 공유한다. 또한 모바일은 "작은 WordCard"가 아니라 정보 구조가 다르다 —
 * 단어+뜻만 1차로 보여주고 영영뜻·동의어·예문은 접어 둔다.
 *
 * 값이 undefined인 필드는 섹션 자체를 그리지 않는다(개인 단어 대응 — MobileWordItem 주석 참고).
 */
export function MobileWordCard({
  item,
  showSentence = false,
  extraInfo,
  hideWord = false,
  hideMeaning = false,
}: Props) {
  // 카드별 공개 상태. 툴바 토글은 목록 전체를 가리고, 이 상태는 카드 하나만 되돌린다.
  const [revealedWord, setRevealedWord] = useState(false);
  const [revealedMeaning, setRevealedMeaning] = useState(false);
  // 영영뜻·동의어·예문 펼침 상태. 폰에서는 기본으로 접어 목록 훑기를 빠르게 한다.
  const [expanded, setExpanded] = useState(false);

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

  const hasDetails =
    Boolean(item.engMeaning) ||
    (item.synonyms?.length ?? 0) > 0 ||
    (showSentence && Boolean(item.sentence));

  // 메타 줄에 실제로 그릴 뱃지가 있는지. 개인 단어는 셋 다 없어 줄 자체를 그리지 않는다 —
  // 북마크만 남은 빈 줄이 서 있으면(버튼 높이 ~38px + mb-2) 단어 위에 큰 여백이 생긴다.
  const hasMeta =
    item.difficulty !== undefined ||
    item.satPriority !== undefined ||
    item.wrongCount !== undefined;

  return (
    <article className="relative bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
      {/* 북마크 등 부가 버튼은 메타 줄 유무와 무관하게 항상 카드 우상단에 둔다 —
          흐름에 넣으면 뱃지가 없는 카드에서 줄 하나를 통째로 차지한다. */}
      {extraInfo && <div className="absolute top-3 right-3">{extraInfo}</div>}

      {/* 메타 줄 — LEVEL·별점·틀린 횟수는 정답이 아니므로 가리기와 무관하게 항상 노출한다.
          pr-10은 위 절대 배치된 북마크와 겹치지 않기 위한 여백. */}
      {hasMeta && (
        <div className="flex items-center gap-2 mb-2 min-h-6 pr-10">
          {item.difficulty !== undefined && (
            <span className="px-2 py-0.5 bg-surface-container-highest text-primary text-[10px] font-bold tracking-widest uppercase rounded-full">
              LV {item.difficulty}
            </span>
          )}
          {item.satPriority !== undefined && <SatStars priority={item.satPriority} />}
          {item.wrongCount !== undefined && (
            <span className="px-2 py-0.5 bg-error/5 border border-error/20 text-error text-[10px] font-bold rounded-full">
              {item.wrongCount}x wrong
            </span>
          )}
        </div>
      )}

      <Maskable
        hidden={wordMasked}
        enabled={hideWord}
        label={wordMasked ? 'Show word' : 'Hide word again'}
        onClick={() => setRevealedWord(!revealedWord)}
      >
        {/* 메타 줄이 없으면 단어가 카드 맨 위에 오므로 북마크를 피할 여백이 필요하다. */}
        <h2
          className={`font-headline font-bold text-xl text-primary break-words ${hasMeta ? '' : 'pr-10'}`}
        >
          {item.word}
        </h2>
      </Maskable>

      <Maskable
        hidden={meaningMasked}
        enabled={hideMeaning}
        label={meaningMasked ? 'Show meaning' : 'Hide meaning again'}
        onClick={() => setRevealedMeaning(!revealedMeaning)}
      >
        <div className="mt-1.5">
          <p className="text-primary font-bold text-base break-words">
            {item.partsOfSpeech && item.partsOfSpeech.length > 0 && (
              <span className="text-on-tertiary-container tracking-wider mr-2">
                {item.partsOfSpeech.join(' / ')}
              </span>
            )}
            {item.korMeaning}
          </p>

          {/* 부가 정보는 접어 둔다 — 목록을 빠르게 훑는 것이 폰의 주 용도라서다. */}
          {hasDetails && expanded && (
            <div className="mt-3 space-y-3">
              {item.engMeaning && (
                <p className="text-on-surface-variant leading-relaxed font-body text-sm">
                  {item.engMeaning}
                </p>
              )}
              {item.synonyms && item.synonyms.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-1.5">
                    Synonyms
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.synonyms.map((syn) => (
                      <span
                        key={syn}
                        className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {showSentence && item.sentence && (
                <div className="bg-surface-container-low rounded-lg px-3 py-2.5">
                  <h4 className="text-[10px] uppercase tracking-wider text-outline font-bold mb-1">
                    Sentence
                  </h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    "{item.sentence}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Maskable>

      {/* 기출 태그는 정답이 아니므로 마스크 바깥. */}
      {item.examTags && item.examTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {item.examTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-surface-container-highest text-outline text-[11px] font-bold rounded-full tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {hasDetails && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2.5 flex items-center gap-1 min-h-11 -mb-2 text-xs font-bold text-on-surface-variant touch-manipulation"
          aria-expanded={expanded}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
          {expanded ? 'Less' : 'More'}
        </button>
      )}
    </article>
  );
}
