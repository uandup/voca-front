interface Props {
  // 진행 중 세트 수
  activeSetCount: number;
  // 진행 중 세트의 단어 합 — 지금 외워야 할 몫
  activeWordCount: number;
  // 오답 뱅크에 쌓인 단어 수
  reviewCount: number;
}

/**
 * Word Sets 탭 상단의 현황 요약.
 *
 * **누를 수 없는 요소다.** 이 화면의 다른 카드는 전부 "테두리 있는 흰 카드 = 누르면 이동"이라,
 * 요약도 같은 모양이면 눌렀는데 아무 일도 안 일어나는 카드가 된다.
 * 그래서 채운 배경 + 테두리 없음 + chevron 없음으로 생김새를 갈라 놓는다.
 *
 * 데이터를 직접 조회하지 않고 값만 받는다 — 페이지가 이미 같은 쿼리를 구독하고 있어
 * 여기서 훅을 또 부르면 같은 데이터에 두 번 붙는다.
 *
 * **제목을 두지 않는다.** 이 카드가 Word Sets 탭에서 화면 맨 위 첫 요소이고, 어느 탭인지는
 * 하단 탭바가 말해준다 — 그 위에 제목을 또 얹으면 같은 말이 두 번이다.
 * 대신 범위는 라벨이 직접 말한다: To study / To review처럼 "할 일"로 읽히게 두고,
 * 제목이 잡아주던 몫을 라벨이 가져간다.
 */
export function WordSetSummary({ activeSetCount, activeWordCount, reviewCount }: Props) {
  return (
    <div className="bg-surface-container-low rounded-2xl px-5 py-4">
      <div className="flex items-center">
        <Stat value={activeSetCount} label="Sets" />
        <Divider />
        <Stat value={activeWordCount} label="To study" />
        <Divider />
        {/* 세 숫자를 다 칠하면 아무것도 강조되지 않는다.
            오답만, 그것도 처리할 게 남았을 때만 색을 준다. */}
        <Stat value={reviewCount} label="To review" accent={reviewCount > 0} />
      </div>
    </div>
  );
}

function Stat({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col items-center">
      {/* tabular-nums — 자릿수가 달라도 숫자 폭이 고정돼 세 칸이 흔들리지 않는다. */}
      <span
        className={`text-[20px] font-bold leading-none tabular-nums ${
          accent ? 'text-primary' : 'text-on-surface'
        }`}
      >
        {value}
      </span>
      {/* whitespace-nowrap — 한 칸만 2줄이 되면 세 숫자의 밑줄이 어긋난다. */}
      <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/60 mt-2 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

// 여백만으로는 세 칸이 뭉쳐 보인다.
function Divider() {
  return <span className="w-px h-8 bg-outline-variant/40 shrink-0" />;
}
