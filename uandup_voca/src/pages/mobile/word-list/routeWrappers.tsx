import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useAssignedWords } from '@/entities/student';
import { useReviewDeckWords } from '@/entities/review-deck';
import { usePersonalWordsBySet } from '@/entities/personal-word';
import { usePersonalWordSets } from '@/entities/personal-word-set';
import { useCurrentStudentId } from '@/entities/auth';
import {
  toMobileWordItems,
  reviewDeckToMobileWordItems,
  personalToMobileWordItems,
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

// 개인 단어는 세트 단위로 조회한다 — 세트 목록은 MobilePersonalWordSetListPage가 담당하고,
// 이 wrapper는 세트 하나의 단어만 보여준다.
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
  const setName = sets.find((s) => s.id === personalWordSetId)?.name ?? 'Personal Words';

  return (
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
    />
  );
}
