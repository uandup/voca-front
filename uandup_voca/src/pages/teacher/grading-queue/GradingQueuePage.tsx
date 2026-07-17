import { PageTitle } from '@/shared/ui/PageTitle';
import { useSubmittedExams } from '@/entities/grading-queue';
import { GradingQueueRow } from './ui/GradingQueueRow';
import { formatClockTime } from './model/formatTime';

// 학원 전체 채점 대기 큐. 학생이 온라인 제출(SUBMITTED)한 시험을 오래 기다린 순으로 보여주고,
// 항목 클릭 시 기존 채점 화면으로 이동한다. 폴링·push 없이 Refresh 버튼이 유일한 갱신 트리거다.
export default function GradingQueuePage() {
  const { data: items = [], isLoading, isError, isFetching, refetch, dataUpdatedAt } =
    useSubmittedExams();

  return (
    <main>
      {/* 제목 줄 우측에 Refresh + 마지막 갱신 시각. 폴링이 없으므로 지금 보는 목록의
          스냅샷 시점을 라벨로 노출해 선생님이 신선도를 판단하게 한다. */}
      <div className="flex items-center justify-between">
        <PageTitle title="Grading Queue" />
        <div className="flex items-center gap-3">
          {dataUpdatedAt > 0 && (
            <span className="text-sm text-on-surface-variant">
              Last updated {formatClockTime(dataUpdatedAt)}
            </span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={`material-symbols-outlined ${isFetching ? 'animate-spin' : ''}`}
              style={{ fontSize: '18px' }}
            >
              refresh
            </span>
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-on-surface-variant">Loading...</p>
      ) : isError ? (
        <p className="mt-6 text-sm text-error">
          Failed to load the grading queue. Please try refreshing.
        </p>
      ) : items.length === 0 ? (
        // 빈 큐는 정상이자 목표 상태 — 부정적 문구 대신 "다 채점됨"으로 긍정 표현한다.
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <span className="material-symbols-outlined text-success" style={{ fontSize: '40px' }}>
            task_alt
          </span>
          <p className="font-bold text-on-surface">No exams waiting to be graded</p>
          <p className="text-sm text-on-surface-variant">
            Submitted online exams will appear here. 🎉
          </p>
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          {items.map((item) => (
            <GradingQueueRow key={item.examId} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
