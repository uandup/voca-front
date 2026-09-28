import { useNavigate } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LevelBlock } from '@/entities/word';
import { useActiveStudySetList, useStudySetHistory, toStudySetRow } from '@/entities/student';
import type { StudySetRow } from '@/entities/student';
import { useReviewDeckCount } from '@/entities/review-deck';
import { usePersonalWords } from '@/entities/personal-word';
import { useCurrentStudentId } from '@/entities/auth';
import { MobileScreenHeader } from '@/widgets/mobile-nav';

function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * 모바일 홈 — 어떤 단어 묶음을 볼지 고르는 화면.
 *
 * StudySet에는 제목 필드가 없다(StudySetRow = studySetId/levels/wordCount/assignedDate/...).
 * 그래서 레벨 칩 + 단어 수 + 배정일로 행을 식별할 수 있게 만든다.
 */
export function MobileLibraryPage() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;

  const { data: activeSets = [], isLoading: activeLoading } = useActiveStudySetList(studentId);
  const { data: historyData, isLoading: historyLoading } = useStudySetHistory(studentId);
  const { data: reviewCount = 0 } = useReviewDeckCount(studentId);
  const { data: personalWords = [] } = usePersonalWords(studentId, studentId > 0);

  // 이력은 무한스크롤이지만 홈에서는 첫 페이지만 보여준다 — 전체 열람은 목록 화면의 몫이 아니다.
  const pastSets = (historyData?.pages ?? []).flatMap((page) =>
    (page.data?.content ?? []).map(toStudySetRow),
  );

  const isLoading = activeLoading || historyLoading;

  return (
    <div className="px-4 pt-4">
      <MobileScreenHeader title="My Words" />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          <Section title="In Progress">
            {activeSets.length === 0 ? (
              <EmptyState icon="assignment" title="No active assignment." />
            ) : (
              activeSets.map((set) => (
                <StudySetRowCard
                  key={set.studySetId}
                  set={set}
                  onClick={() =>
                    navigate({
                      to: '/m/words/assigned/$studySetId',
                      params: { studySetId: String(set.studySetId) },
                      search: { view: 'list' },
                    })
                  }
                />
              ))
            )}
          </Section>

          <Section title="Other Word Sets">
            <SummaryRow
              icon="error"
              label="Review Deck"
              description={`${reviewCount} words you got wrong`}
              onClick={() => navigate({ to: '/m/words/review', search: { view: 'list' } })}
            />
            <SummaryRow
              icon="auto_stories"
              label="Personal Words"
              description={`${personalWords.length} words`}
              onClick={() => navigate({ to: '/m/words/personal' })}
            />
          </Section>

          {pastSets.length > 0 && (
            <Section title="Past Assignments">
              {pastSets.map((set) => (
                <StudySetRowCard
                  key={set.studySetId}
                  set={set}
                  onClick={() =>
                    navigate({
                      to: '/m/words/assigned/$studySetId',
                      params: { studySetId: String(set.studySetId) },
                      search: { view: 'list' },
                    })
                  }
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function StudySetRowCard({ set, onClick }: { set: StudySetRow; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 flex items-center gap-3 touch-manipulation"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {set.levels.map((lv) => (
            <LevelBlock key={lv.level} level={lv.level} />
          ))}
        </div>
        <p className="text-sm font-bold text-on-surface mt-2">{set.wordCount} words</p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Assigned {formatDate(set.assignedDate)}
        </p>
      </div>
      <span
        className="material-symbols-outlined text-outline shrink-0"
        style={{ fontSize: '22px' }}
      >
        chevron_right
      </span>
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
      className="w-full text-left bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 flex items-center gap-3 touch-manipulation"
    >
      <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '24px' }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
      </div>
      <span
        className="material-symbols-outlined text-outline shrink-0"
        style={{ fontSize: '22px' }}
      >
        chevron_right
      </span>
    </button>
  );
}
