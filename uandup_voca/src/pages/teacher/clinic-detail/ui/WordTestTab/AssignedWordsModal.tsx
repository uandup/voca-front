import { Fragment } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { WordCard } from '@/entities/word';
import type { BundleLevelCount } from '@/entities/test';
import { useAssignedWords } from '@/features/study-set';

// 한 사이클(study-set)에 배정된 단어들을 read-only로 확인하는 모달.
// CycleRow의 "View Words" 버튼에서 열린다.

interface Props {
  studySetId: number;
  levels: BundleLevelCount[];
  wordCount: number;
  onClose: () => void;
}

export function AssignedWordsModal({ studySetId, levels, wordCount, onClose }: Props) {
  // 선생님 화면이므로 exampleVisible과 무관하게 예문을 항상 표시한다.
  const { data, isLoading } = useAssignedWords(studySetId, true);
  const words = data?.words ?? [];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-8 pt-5 pb-2.5 border-b border-outline-variant/30 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-extrabold font-headline tracking-tight text-primary">
              Assigned Words
            </h2>
            {/* CycleRow와 동일한 패턴 — "Words {N} ( Level1 · X | Level2 · Y LEVEL UP )" */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-on-surface-variant">Words</span>
                <span className="text-xs font-bold text-on-surface">{wordCount}</span>
              </div>
              (
              <div className="flex items-center gap-1.5">
                {levels.length === 0 ? (
                  <>
                    <span className="text-xs text-on-surface-variant">Level</span>
                    <span className="text-xs font-medium text-on-surface">-</span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-on-surface flex items-center gap-1.5">
                    {levels.map((lc, i) => (
                      <Fragment key={lc.level}>
                        {i > 0 && <span className="text-on-surface-variant/40">|</span>}
                        <span>
                          Level {lc.level}
                          <span className="text-on-surface-variant font-medium ml-1">
                            · {lc.count}
                          </span>
                        </span>
                      </Fragment>
                    ))}
                  </span>
                )}
                )
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <p className="text-sm text-on-surface-variant text-center py-8">Loading...</p>
          )}
          {!isLoading && words.length === 0 && (
            <p className="text-sm text-on-surface-variant text-center py-8">No words assigned.</p>
          )}
          {!isLoading && words.length > 0 && (
            <div className="flex flex-col gap-5">
              {words.map((item) => (
                <WordCard key={item.id} {...item} showSentence />
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}
