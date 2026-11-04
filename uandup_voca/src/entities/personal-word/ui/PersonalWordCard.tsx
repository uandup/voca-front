import { useEffect, useState, type ReactNode } from 'react';
import { Maskable } from '@/shared/ui/Maskable';
import type { PersonalWordCardData } from '../model/types';

interface PersonalWordCardProps extends PersonalWordCardData {
  // 카드 외부에서 컨텍스트별로 주입하는 부가 콘텐츠(북마크 버튼 등).
  extraInfo?: ReactNode;
  // 단어를 가린다 — 학생이 뜻을 보고 단어를 떠올리는 용도.
  hideWord?: boolean;
  // 한글 뜻을 가린다 — 단어를 보고 뜻을 떠올리는 용도.
  hideMeaning?: boolean;
  // 세트 안 등록순 번호(1부터). 선생님이 개인 단어장 시험 범위(From~To)를 고를 때 기준이 된다.
  // 생략하면 표시하지 않는다. 검색 필터를 건 목록에서도 전체 목록 기준 번호를 넘겨야 한다.
  orderNumber?: number;
}

// PersonalWord 1건을 표시하는 카드. word/koreanMeaning만 존재해 entities/word의 WordCard와는
// 별개 컴포넌트로 둔다 — WordCard는 품사·영영뜻·동의어·난이도·별점·기출태그까지 갖춘 사전 단어용이라,
// PersonalWord를 억지로 맞추면 "Meaning" 헤더 아래 빈 영영뜻 줄처럼 없는 정보가 있는 것처럼
// 보이는 자리들이 생긴다.
export function PersonalWordCard({
  word,
  koreanMeaning,
  extraInfo,
  hideWord = false,
  hideMeaning = false,
  orderNumber,
}: PersonalWordCardProps) {
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

  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden border shadow-sm border-outline-variant/60 relative group">
      <div className="p-8">
        <div className="flex items-center gap-12">
          <div className="w-1/4">
            {orderNumber !== undefined && (
              <span className="text-[11px] font-bold text-on-surface-variant/60 block mb-1">
                #{orderNumber}
              </span>
            )}
            <Maskable
              hidden={wordMasked}
              enabled={hideWord}
              label={wordMasked ? 'Show word' : 'Hide word again'}
              onClick={() => setRevealedWord(!revealedWord)}
            >
              <h2 className="font-headline font-bold text-2xl text-primary">{word}</h2>
            </Maskable>
          </div>

          <div className="flex-1 min-w-0">
            <Maskable
              hidden={meaningMasked}
              enabled={hideMeaning}
              label={meaningMasked ? 'Show meaning' : 'Hide meaning again'}
              onClick={() => setRevealedMeaning(!revealedMeaning)}
            >
              <p className="text-primary font-bold text-2xl">{koreanMeaning}</p>
            </Maskable>
          </div>

          {extraInfo && <div className="shrink-0 self-start">{extraInfo}</div>}
        </div>
      </div>
    </article>
  );
}
