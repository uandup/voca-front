import { useParams, useSearch } from '@tanstack/react-router';
import { useAssignedWords, useStudentOverview } from '@/entities/student';
import { usePersonalWordsBySet } from '@/entities/personal-word';
import type { PersonalWordCardData } from '@/entities/personal-word';
import { useCurrentStudentId } from '@/entities/auth';
import { SelfTestView } from './SelfTestView';
import type { SelfTestWord } from './model/selfTestQuestions';

// 두 라우트가 같은 SelfTestView를 쓰지만 단어 출처가 다르다.
// 라우트마다 별도 wrapper 컴포넌트를 두는 이유:
//  (1) 훅을 조건부로 호출하지 않게 된다 — 라우트가 다르면 컴포넌트 자체가 다르다.
//  (2) 라우트 파일에 컴포넌트 정의가 없어져 react-refresh 경고가 뜨지 않는다.
// pages/mobile/word-list/routeWrappers.tsx와 같은 패턴이다.

export function StudySetSelfTestRoute() {
  const { studySetId: studySetIdParam } = useParams({ from: '/student_/self-test/$studySetId' });
  const { returnTo } = useSearch({ from: '/student_/self-test/$studySetId' });

  const studySetId = Number(studySetIdParam);
  const studentId = useCurrentStudentId() ?? 0;

  // 단어는 Words 페이지에서 이미 받아 캐시된 목록을 그대로 쓴다.
  const { data: wordsData, isLoading: wordsLoading } = useAssignedWords(studySetId, studySetId > 0);
  // 실제 시험 설정(선생님이 정한 값) — 대시보드 Test Configuration과 같은 조회 API를 읽기만 한다.
  const { data: overview, isLoading: overviewLoading } = useStudentOverview(studentId);

  return (
    <SelfTestView
      words={wordsData?.words ?? []}
      isLoading={wordsLoading || overviewLoading}
      returnTo={returnTo}
      realSettings={
        overview
          ? {
              testType: overview.testType,
              questionCount: overview.testQuestionCount,
              includeSynonyms: overview.includeSynonyms,
            }
          : undefined
      }
    />
  );
}

/**
 * 개인 단어는 단어·한글뜻뿐이다 — 영영뜻·동의어는 개념 자체가 없어 빈 값으로 채운다.
 *
 * 그 빈 값이 화면에 드러나지 않게 두 가지를 함께 건다:
 *  - supportsSynonyms={false} → 동의어 토글이 사라져 빈 입력칸이 뜰 수 없다
 *  - VocabAnswerRow/VocabReviewRow가 engMeaning을 조건부로 렌더 → 빈 줄이 여백으로 남지 않는다
 */
function toSelfTestWords(words: PersonalWordCardData[]): SelfTestWord[] {
  return words.map((w) => ({
    word: w.word,
    korMeaning: w.koreanMeaning,
    engMeaning: '',
    synonyms: [],
  }));
}

export function PersonalSetSelfTestRoute() {
  const { personalWordSetId: setIdParam } = useParams({
    from: '/student_/personal-self-test/$personalWordSetId',
  });
  const { returnTo } = useSearch({ from: '/student_/personal-self-test/$personalWordSetId' });

  const personalWordSetId = Number(setIdParam);
  const { data: words = [], isLoading } = usePersonalWordsBySet(
    personalWordSetId,
    personalWordSetId > 0,
  );

  return (
    <SelfTestView
      words={toSelfTestWords(words)}
      isLoading={isLoading}
      returnTo={returnTo}
      // 개인 세트엔 "선생님이 정한 시험 설정"이 없다 — realSettings를 넘기지 않으면
      // useSelfTest가 word-to-meaning + 전체 단어로 폴백한다.
      supportsSynonyms={false}
      showRealSettingsHint={false}
      setupDescription="Practice with the words in this set. Your answers are not saved."
    />
  );
}
