interface Props {
  // 전체 정답률 — '85%' 형태. COMPLETED 시험이 없으면 undefined.
  accuracy: string | undefined;
  // 진행 중 NORMAL 배정 단어 수.
  assignedWordCount: number;
  // 풀어야 할 리뷰 시험 단어 수.
  pendingReviewWordCount: number;
  // Assigned Words 카드 클릭 핸들러 — 호출부가 단어 리스트 라우트로 이동시킨다.
  // 미전달 시 카드는 비-인터랙티브로 렌더된다(교사 페이지 등).
  onAssignedClick?: () => void;
  // Words to Review 카드 클릭 핸들러 — 미전달 시 비-인터랙티브.
  onReviewClick?: () => void;
}

export function StatCards({
  accuracy,
  assignedWordCount,
  pendingReviewWordCount,
  onAssignedClick,
  onReviewClick,
}: Props) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-4 xl:gap-6">
      {/* Overall Accuracy */}
      <div className="bg-linear-to-br from-primary to-primary-container p-4 xl:p-6 rounded-xl shadow-lg text-white flex-1 flex flex-col justify-center">
        <p className="text-xs font-bold text-white/70 mb-2 uppercase tracking-widest">
          Overall Accuracy
        </p>
        <div className="flex items-center gap-4">
          <span className="text-2xl xl:text-4xl font-black font-headline">{accuracy ?? '—'}</span>
        </div>
      </div>

      {/* Assigned Words — 클릭 핸들러가 있을 때만 인터랙티브 스타일과 'View words' 화살표를 노출한다. */}
      <div
        role={onAssignedClick ? 'button' : undefined}
        tabIndex={onAssignedClick ? 0 : undefined}
        onClick={onAssignedClick}
        onKeyDown={
          onAssignedClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAssignedClick();
                }
              }
            : undefined
        }
        className={`bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-4 xl:p-6 rounded-xl flex-1 flex flex-col justify-center transition-all ${
          onAssignedClick ? 'cursor-pointer hover:border-primary/30 hover:shadow-md' : 'opacity-50'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary text-base">menu_book</span>
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Assigned Words</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl xl:text-4xl font-black text-primary font-headline">
              {assignedWordCount}
            </span>
            {!onAssignedClick && (
              <p className="text-xs text-outline mt-1">No words available</p>
            )}
          </div>
          {onAssignedClick && (
            <div className="flex items-center -mr-2 xl:-mr-3">
              <span className="text-sm xl:text-lg font-bold text-primary/60">View words</span>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>
                chevron_right
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Words to Review — onReviewClick이 있을 때만 인터랙티브 스타일과 'View words' 화살표를 노출한다.
          없을 때(0개 또는 교사 뷰)는 아이콘·텍스트·숫자를 모두 흐리게 표시해 비활성임을 전달한다. */}
      <div
        role={onReviewClick ? 'button' : undefined}
        tabIndex={onReviewClick ? 0 : undefined}
        onClick={onReviewClick}
        onKeyDown={
          onReviewClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onReviewClick();
                }
              }
            : undefined
        }
        className={`bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-4 xl:p-6 rounded-xl flex-1 flex flex-col justify-center transition-all ${
          onReviewClick ? 'cursor-pointer hover:border-green-600/30 hover:shadow-md' : 'opacity-50'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`material-symbols-outlined text-base ${onReviewClick ? 'text-green-600' : 'text-outline'}`}
          >
            auto_stories
          </span>
          <p
            className={`text-xs font-bold uppercase tracking-widest ${onReviewClick ? 'text-green-600' : 'text-outline'}`}
          >
            Words to Review
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-2xl xl:text-4xl font-black font-headline ${onReviewClick ? 'text-green-600' : 'text-outline'}`}
            >
              {pendingReviewWordCount}
            </span>
            {!onReviewClick && (
              <p className="text-xs text-outline mt-1">No words available</p>
            )}
          </div>
          {onReviewClick && (
            <div className="flex items-center -mr-2 xl:-mr-3">
              <span className="text-sm xl:text-lg font-bold text-green-600/60">View words</span>
              <span
                className="material-symbols-outlined text-green-600"
                style={{ fontSize: '28px' }}
              >
                chevron_right
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
