import { useState } from 'react';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { ConfirmDialog } from '@/shared/ui/Modal';
import { useAssignedWords } from '@/entities/student';
import { useReviewDeckWords } from '@/entities/review-deck';
import { usePersonalWordsBySet } from '@/entities/personal-word';
import type { PersonalWordCardData } from '@/entities/personal-word';
import { usePersonalWordSets } from '@/entities/personal-word-set';
import { useCurrentStudentId } from '@/entities/auth';
import {
  usePersonalWordActions,
  usePersonalWordSetActions,
  MobilePersonalWordFormModal,
  MobilePersonalWordSetFormModal,
  MobilePersonalWordSetMenu,
} from '@/features/personal-word';
import {
  toMobileWordItems,
  reviewDeckToMobileWordItems,
  personalToMobileWordItems,
  type MobileWordItem,
  type MobileWordView,
} from '@/widgets/mobile-word-viewer';
import { MobileWordListPage } from './MobileWordListPage';

// 세 라우트가 같은 MobileWordListPage를 쓰지만 데이터 소스와 북마크 스코프가 다르다.
// (개인 단어는 세트 목록 화면이 한 단계 앞에 더 있다 — MobilePersonalWordSetListPage.)
// 라우트마다 별도 wrapper 컴포넌트를 두는 이유:
//  (1) 훅을 조건부로 호출하지 않게 된다 — 라우트가 다르면 컴포넌트 자체가 다르다.
//  (2) 라우트 파일에 컴포넌트 정의가 없어져 react-refresh 경고가 뜨지 않는다.
// 데스크탑 pages/student/study-set-words/routeWrappers.tsx와 같은 패턴이다.

export function MobileAssignedWordsRoute() {
  const navigate = useNavigate();
  const { studySetId } = useParams({ from: '/m/words/assigned/$studySetId' });
  const { view } = useSearch({ from: '/m/words/assigned/$studySetId' });
  const id = Number(studySetId);

  const { data, isLoading } = useAssignedWords(id, id > 0);

  return (
    <MobileWordListPage
      title="Assigned Words"
      items={toMobileWordItems(data?.words ?? [])}
      isLoading={isLoading}
      scopeKey={`studyset_${id}`}
      // 예문 노출은 서버의 exampleVisible을 따른다 (NORMAL 배정은 예문시험 채점 후에만 true).
      showSentence={data?.exampleVisible ?? false}
      onBack={() => navigate({ to: '/m/library' })}
      view={view}
      onChangeView={(next: MobileWordView) =>
        navigate({
          to: '/m/words/assigned/$studySetId',
          params: { studySetId },
          search: { view: next },
        })
      }
    />
  );
}

export function MobileReviewDeckWordsRoute() {
  const navigate = useNavigate();
  const { view } = useSearch({ from: '/m/words/review' });
  const studentId = useCurrentStudentId() ?? 0;

  const { data = [], isLoading } = useReviewDeckWords(studentId, studentId > 0);

  return (
    <MobileWordListPage
      title="Review Deck"
      items={reviewDeckToMobileWordItems(data)}
      isLoading={isLoading}
      scopeKey={`wrongwords_${studentId}`}
      // 오답 단어는 이미 시험을 치른 단어라 예문을 항상 공개한다.
      showSentence
      onBack={() => navigate({ to: '/m/library' })}
      view={view}
      onChangeView={(next: MobileWordView) =>
        navigate({ to: '/m/words/review', search: { view: next } })
      }
    />
  );
}

// MobileWordItem은 세 소스가 공유하는 뷰모델이라 필드명이 korMeaning이다.
// 개인 단어 mutation은 koreanMeaning을 쓰므로 여기서 되돌린다.
function toPersonalWord(item: MobileWordItem): PersonalWordCardData {
  return { id: item.id, word: item.word, koreanMeaning: item.korMeaning };
}

/**
 * 개인 단어는 세트 단위로 조회한다 — 세트 목록은 MobilePersonalWordSetListPage가 담당하고,
 * 이 wrapper는 세트 하나의 단어만 보여준다.
 *
 * **쓰기(등록·수정·삭제)를 가진 유일한 wrapper다.** 모달 상태를 전부 여기서 들고 있고
 * MobileWordListPage에는 자리(headerAction)와 핸들러(wordActions)만 넘긴다 —
 * 그 화면은 배정·오답 단어도 함께 쓰므로 개인 단어를 알게 하지 않는다.
 */
export function MobilePersonalWordSetWordsRoute() {
  const navigate = useNavigate();
  const { personalWordSetId: setIdParam } = useParams({
    from: '/m/words/personal/$personalWordSetId',
  });
  const { view } = useSearch({ from: '/m/words/personal/$personalWordSetId' });
  const personalWordSetId = Number(setIdParam);
  const studentId = useCurrentStudentId() ?? 0;

  const { data = [], isLoading } = usePersonalWordsBySet(
    personalWordSetId,
    personalWordSetId > 0,
  );
  // 세트 이름을 제목에 쓴다 — 목록 캐시에서 찾으므로 추가 요청이 없다.
  const { data: sets = [] } = usePersonalWordSets(studentId, studentId > 0);
  const set = sets.find((s) => s.id === personalWordSetId);
  const setName = set?.name ?? 'Personal Words';

  // 'new' = 단어 등록, PersonalWordCardData = 그 단어 수정, null = 닫힘.
  const [wordForm, setWordForm] = useState<PersonalWordCardData | 'new' | null>(null);
  const [deleteWordTarget, setDeleteWordTarget] = useState<PersonalWordCardData | null>(null);
  const [setMenuOpen, setSetMenuOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteSetOpen, setDeleteSetOpen] = useState(false);

  const { remove: removeWord } = usePersonalWordActions({ studentId, personalWordSetId });
  const { remove: removeSet } = usePersonalWordSetActions(studentId);

  // studentId는 useCurrentStudentId() ?? 0이다. 0인 채로 mutate하면 세트 목록 갱신 키가
  // 어긋나고, 세트 생성 경로는 /students/0/...으로 날아간다. 조회는 enabled로 막혀 있지만
  // mutation에는 그게 없으니 **버튼 자체를 그리지 않는다.**
  // set이 아직 안 들어왔을 때 메뉴를 열면 이름·단어수가 빈 시트가 뜨므로 그것도 함께 기다린다.
  const canWrite = studentId > 0 && set !== undefined;

  return (
    <>
      <MobileWordListPage
        title={setName}
        items={personalToMobileWordItems(data)}
        isLoading={isLoading}
        // 데스크탑 세트 상세와 같은 키 — 같은 브라우저라면 북마크가 양쪽에서 공유된다.
        scopeKey={`personalwordset_${personalWordSetId}`}
        onBack={() => navigate({ to: '/m/words/personal' })}
        // 플래시카드·셔플을 켠다. 단어 앞/뜻 뒤는 플래시카드의 가장 전형적인 쓰임이고,
        // 폰은 학생이 직접 모은 단어를 외우는 주 화면이다.
        // (MobileWordFlashcard는 engMeaning·synonyms를 조건부로 그려 개인 단어를 이미 지원한다.)
        view={view}
        onChangeView={(next: MobileWordView) =>
          navigate({
            to: '/m/words/personal/$personalWordSetId',
            params: { personalWordSetId: setIdParam },
            search: { view: next },
          })
        }
        headerAction={
          canWrite ? (
            <div className="flex items-center gap-0.5">
              <HeaderIconButton
                icon="add"
                label="Add word"
                onClick={() => setWordForm('new')}
              />
              <HeaderIconButton
                icon="more_vert"
                label="Set options"
                onClick={() => setSetMenuOpen(true)}
              />
            </div>
          ) : undefined
        }
        wordActions={
          canWrite
            ? {
                onEdit: (item) => setWordForm(toPersonalWord(item)),
                onDelete: (item) => setDeleteWordTarget(toPersonalWord(item)),
              }
            : undefined
        }
      />

      {wordForm && (
        <MobilePersonalWordFormModal
          studentId={studentId}
          personalWordSetId={personalWordSetId}
          target={wordForm === 'new' ? undefined : wordForm}
          onClose={() => setWordForm(null)}
        />
      )}

      {deleteWordTarget && (
        <ConfirmDialog
          title="Delete word?"
          description={`"${deleteWordTarget.word}" will be removed from this set.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => removeWord.mutate(deleteWordTarget.id)}
          onCancel={() => setDeleteWordTarget(null)}
        />
      )}

      {setMenuOpen && set && (
        <MobilePersonalWordSetMenu
          target={set}
          onRename={() => {
            setSetMenuOpen(false);
            setRenameOpen(true);
          }}
          onDelete={() => {
            setSetMenuOpen(false);
            setDeleteSetOpen(true);
          }}
          onClose={() => setSetMenuOpen(false)}
        />
      )}

      {renameOpen && set && (
        <MobilePersonalWordSetFormModal
          studentId={studentId}
          target={set}
          onClose={() => setRenameOpen(false)}
        />
      )}

      {deleteSetOpen && set && (
        <ConfirmDialog
          title="Delete set?"
          description={`"${set.name}" and its ${set.wordCount} ${set.wordCount === 1 ? 'word' : 'words'} will be removed.`}
          confirmLabel="Delete"
          variant="danger"
          // 지워진 세트 화면에 남아 있으면 안 된다 — 목록으로 되돌린다.
          onConfirm={() =>
            removeSet.mutate(set.id, {
              onSuccess: () => navigate({ to: '/m/words/personal' }),
            })
          }
          onCancel={() => setDeleteSetOpen(false)}
        />
      )}
    </>
  );
}

// 헤더 우측 44px 아이콘 버튼. MobileWordToolbar의 IconToggle과 같은 치수지만
// 그쪽은 module-private이고 토글(active/badge) 개념이 붙어 있어 여기서 재사용하지 않는다.
function HeaderIconButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-11 h-11 flex items-center justify-center rounded-xl text-on-surface-variant touch-manipulation active:bg-surface-container-low transition-colors"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
        {icon}
      </span>
    </button>
  );
}
