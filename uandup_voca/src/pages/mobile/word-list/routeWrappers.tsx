import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useAssignedWords } from '@/entities/student';
import { useReviewDeckWords } from '@/entities/review-deck';
import { usePersonalWords } from '@/entities/personal-word';
import { useCurrentStudentId } from '@/entities/auth';
import {
  toMobileWordItems,
  reviewDeckToMobileWordItems,
  personalToMobileWordItems,
  type MobileWordView,
} from '@/widgets/mobile-word-viewer';
import { MobileWordListPage } from './MobileWordListPage';

// 세 라우트가 같은 MobileWordListPage를 쓰지만 데이터 소스와 북마크 스코프가 다르다.
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

export function MobilePersonalWordsRoute() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;

  const { data = [], isLoading } = usePersonalWords(studentId, studentId > 0);

  return (
    <MobileWordListPage
      title="Personal Words"
      items={personalToMobileWordItems(data)}
      isLoading={isLoading}
      scopeKey={`personalwords_${studentId}`}
      onBack={() => navigate({ to: '/m/library' })}
      // 개인 단어는 단어·한글뜻뿐이라 뒤집을 내용이 빈약하고 섞을 이유도 적다 → 리스트 전용.
      view="list"
      onChangeView={() => {}}
      supportsFlashcard={false}
      supportsShuffle={false}
    />
  );
}
