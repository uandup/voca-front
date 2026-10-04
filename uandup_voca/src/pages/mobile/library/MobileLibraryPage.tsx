import { useNavigate } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useActiveStudySetList, toStudentTestBundleRow } from '@/entities/student';
import type { StudySetRow } from '@/entities/student';
import { useReviewDeckCount } from '@/entities/review-deck';
import { useCurrentStudentId } from '@/entities/auth';
import { StepDots } from './ui/StepDots';
import { WordSetSummary } from './ui/WordSetSummary';
import { toLevelLabel } from './model/stepProgress';

function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * 모바일 홈(Word Sets 탭) — 배정 단어 묶음을 고르는 화면.
 *
 * StudySet에는 제목 필드가 없다(StudySetRow = studySetId/levels/wordCount/assignedDate/...).
 * 그래서 레벨 칩 + 단어 수로 행을 식별하고, 진행 중인 세트는 5단계 진행 점으로 "어디까지 했는지"를 보여준다.
 *
 * 개인 단어장은 별도 탭(/m/words/personal)이라 여기 없다.
 *
 * 화면 상단 제목("Word Sets")은 두지 않는다 — 탭 최상위 화면이라 하단 탭바의 라벨이
 * 이미 같은 말을 하고 있다. 대신 pt-6으로 제목이 들고 있던 윗여백만 남긴다.
 * 뒤로가기가 있는 하위 화면(단어 목록 등)은 제목을 유지한다 — 거기는 탭바가 알려주지 못한다.
 *
 * **과거 배정은 일부러 노출하지 않는다** — 이 앱은 지금 외울 것만 보여주는 자리고,
 * 끝난 세트를 다시 볼 일은 데스크탑에서 처리한다. 화면 자체(/m/words/past)는 남아 있지만
 * 여기에 들어가는 입구가 없어 사실상 닫힌 상태다(필요해지면 SummaryRow 한 줄로 되살린다).
 * 그래서 useStudySetHistory도 더 부르지 않는다 — 안 보여줄 목록을 받을 이유가 없다.
 */
export function MobileLibraryPage() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;

  const { data: activeSets = [], isLoading } = useActiveStudySetList(studentId);
  const { data: reviewCount = 0 } = useReviewDeckCount(studentId);

  // 상단 요약용 — 추가 조회 없이 이미 받은 목록에서 더한다.
  // "진행 중 세트의 단어 합" = 지금 외워야 할 몫. 과거 배정 단어는 들어가지 않는다.
  const activeWordCount = activeSets.reduce((sum, set) => sum + set.wordCount, 0);

  function openStudySet(studySetId: number) {
    navigate({
      to: '/m/words/assigned/$studySetId',
      params: { studySetId: String(studySetId) },
      search: { view: 'list' },
    });
  }

  return (
    <div className="px-4 pt-6">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {/* 제목을 두지 않는다 — 화면 제목도, 섹션 제목도. 어느 탭인지는 하단 탭바가 말해주고,
              요약 카드와 그 아래 세트 카드는 같은 것(진행 중 배정)을 접은 것과 펼친 것이라
              제목을 달면 같은 말이 두 번이다. 둘은 간격(space-y-3)만으로 묶인다.

              현황 요약은 로딩 중에는 그리지 않는다(0이 잠깐 보였다 바뀌면 숫자가 튄다).
              isLoading 분기 안이라 자동으로 그렇게 된다. */}
          <section className="space-y-3">
            <WordSetSummary
              activeSetCount={activeSets.length}
              activeWordCount={activeWordCount}
              reviewCount={reviewCount}
            />

            <div className="space-y-2">
              {activeSets.length === 0 ? (
                <EmptyState icon="assignment" title="No active assignment." />
              ) : (
                activeSets.map((set) => (
                  <ActiveStudySetCard
                    key={set.studySetId}
                    set={set}
                    onClick={() => openStudySet(set.studySetId)}
                  />
                ))
              )}
            </div>
          </section>

          {/* 제목 없이 간격만 둔다 — 오답은 배정 세트와 성격이 다른 묶음이라 위 섹션에 넣을 수 없고,
              한 줄짜리 위에 제목을 붙이면 제목이 내용보다 커진다. */}
          <SummaryRow
            icon="error"
            label="Review Deck"
            description={`${reviewCount} words you got wrong`}
            onClick={() => navigate({ to: '/m/words/review', search: { view: 'list' } })}
          />
        </div>
      )}
    </div>
  );
}

/**
 * 진행 중인 배정 카드 — 5단계 진행 점 + 다음 단계 안내.
 *
 * 단계 상태는 toStudentTestBundleRow가 계산한다(entities/student). 여기서 다시 계산하지 않는 이유:
 * 잠금 전파·스킵 처리 규칙이 들어있고, 데스크탑 /student/word-test가 쓰는 바로 그 함수라
 * 따로 구현하면 두 화면이 어긋난다. **학생 시점** 매퍼라는 점이 중요하다 —
 * 교사용 toTestBundleRow는 READY를 "시작 가능"으로 보지만 학생에게는 "아직 못 봄"이다.
 */
function ActiveStudySetCard({ set, onClick }: { set: StudySetRow; onClick: () => void }) {
  const { steps } = toStudentTestBundleRow(set);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface-container-lowest border border-outline-variant/50 rounded-2xl px-5 py-4 touch-manipulation active:bg-surface-container-low transition-colors"
    >
      {/* 타이포는 두 단만 쓴다 — 11px 메타 줄 + 14px 본문 줄.
          Material 3의 overline → headline 구조이고, 크기를 늘리는 대신 굵기·색으로 위계를 준다
          (크기가 4단계로 흩어지면 카드가 산만해진다).

          메타 줄: 배정일. 세트를 서로 구별해주는 정보라 맨 위에 두되, 맥락이지 내용은 아니다.
          본문 줄: 단어 수 + 레벨. 학생이 실제로 보는 값이라 크고 진하게. */}
      <div className="flex items-baseline gap-2">
        <p className="flex-1 min-w-0 flex items-baseline gap-2 text-[11px]">
          <span className="font-bold uppercase tracking-widest text-on-surface-variant/60 shrink-0">
            Assigned
          </span>
          <span className="font-bold tracking-widest text-on-surface-variant/60 tabular-nums">
            {formatDate(set.assignedDate)}
          </span>
        </p>
        <span
          className="material-symbols-outlined text-outline/70 shrink-0 self-center"
          style={{ fontSize: '20px' }}
        >
          chevron_right
        </span>
      </div>

      <h3 className="text-[14px] mt-1.5">
        <span className="font-bold text-on-surface">{set.wordCount} words</span>
        <span className="font-semibold text-on-surface-variant">
          {' · '}
          {toLevelLabel(set.levels)}
        </span>
      </h3>

      <div className="mt-4">
        <StepDots steps={steps} />
      </div>
    </button>
  );
}

function SummaryRow({
  icon,
  label,
  description,
  onClick,
}: {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface-container-lowest border border-outline-variant/50 rounded-2xl px-5 py-4 flex items-center gap-3.5 touch-manipulation active:bg-surface-container-low transition-colors"
    >
      <span
        className="material-symbols-outlined text-primary shrink-0"
        style={{ fontSize: '22px' }}
      >
        {icon}
      </span>
      {/* 배정 카드와 반대 순서(제목 위 · 보조 아래)지만 크기는 같은 두 단을 쓴다 —
          11px 메타 + 14px 본문. 카드마다 글자 크기가 달라지면 목록이 들쭉날쭉해진다. */}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-on-surface">{label}</p>
        <p className="text-[11px] font-semibold text-on-surface-variant mt-1">{description}</p>
      </div>
      <span
        className="material-symbols-outlined text-outline/70 shrink-0"
        style={{ fontSize: '20px' }}
      >
        chevron_right
      </span>
    </button>
  );
}
