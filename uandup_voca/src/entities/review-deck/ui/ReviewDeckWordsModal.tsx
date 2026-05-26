import { Modal } from '@/shared/ui/Modal';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { WordCard } from '@/entities/word/@x/review-deck';
import type { ReviewDeckWord } from '../model/types';

interface Props {
  words: ReviewDeckWord[];
  isLoading: boolean;
  onClose: () => void;
}

// 활성 오답 단어 목록을 표시 — 클리닉 디테일의 "View Word List" 진입점.
// 단순 표시 전용이라 entity-level UI에 둔다(액션 없음).
export function ReviewDeckWordsModal({ words, isLoading, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-8 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-extrabold font-headline tracking-tight text-primary">
              Review Deck Words
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {words.length} active incorrect {words.length === 1 ? 'word' : 'words'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : words.length === 0 ? (
            <EmptyState title="No active incorrect words." />
          ) : (
            <div className="flex flex-col gap-5">
              {words.map((word) => (
                <WordCard
                  key={word.id}
                  id={word.id}
                  difficulty={word.difficulty}
                  word={word.word}
                  partsOfSpeech={word.partsOfSpeech}
                  korMeaning={word.korMeaning}
                  engMeaning={word.engMeaning}
                  synonyms={word.synonyms}
                  sentence={word.sentence}
                  showSentence
                  extraInfo={
                    <div className="flex flex-col items-center justify-center px-3 py-2 bg-error/5 border border-error/20 rounded-lg">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-error/60">
                        Wrong
                      </span>
                      <span className="text-md font-bold text-error">{word.wrongCount}</span>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
