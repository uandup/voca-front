import { useNavigate } from '@tanstack/react-router';
import { ExamViolationBadge, TestConfigBadges } from '@/entities/test';
import type { GradingQueueItem } from '@/entities/grading-queue';
import { examTypeLabel } from '../model/labels';
import {
  formatRelativeTime,
  formatClockTime,
  formatDateTimeShort,
  formatDuration,
} from '../model/formatTime';

interface Props {
  item: GradingQueueItem;
}

// 채점 대기 큐의 한 행. 클릭 시 기존 채점 화면(/teacher/exams/$examId/review)으로 이동한다.
// 진입 시 시험 상태가 SUBMITTED라 ExamReviewPage가 자동으로 grading 모드로 연다.
// studentId/studySetId/examType은 채점 후 정확한 invalidation을 위해 함께 전달한다
// (CreatedPanel의 goReview와 동일 패턴). returnTo로 Exit 시 이 큐로 복귀한다.
//
// 정보 밀도가 높아 2단 레이아웃: 주 라인(누가·무슨 시험) + 메타 라인(언제 배정·얼마나 걸림).
export function GradingQueueRow({ item }: Props) {
  const navigate = useNavigate();

  function goGrade() {
    navigate({
      to: '/teacher/exams/$examId/review',
      params: { examId: String(item.examId) },
      search: {
        returnTo: '/teacher/grading',
        studentId: item.studentId,
        studySetId: item.studySetId,
        examType: item.examType,
      },
    });
  }

  return (
    <button
      onClick={goGrade}
      className="w-full flex flex-col gap-2 px-5 py-4 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 hover:shadow-sm transition-all text-left"
    >
      {/* 주 라인: 학생 이름 + 유형/출제방향/동의어 뱃지 + 문항 수 · (우) 제출 경과 + 치팅 + 진입 화살표 */}
      <div className="flex items-center gap-3 w-full">
        <span className="font-bold text-on-surface truncate min-w-0">{item.studentName}</span>
        <span className="shrink-0 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
          {examTypeLabel(item.examType)}
        </span>
        {/* 예문 시험(EXAMPLE)은 출제 방향이 없어 subType이 null — 이땐 유형 뱃지("Sentence")만으로 충분. */}
        {item.subType !== null && (
          <TestConfigBadges
            config={{ type: item.subType, includeSynonyms: item.includeSynonym }}
          />
        )}
        <span className="shrink-0 text-sm text-on-surface-variant">
          {item.totalCount} questions
        </span>

        <div className="ml-auto flex items-center gap-3 shrink-0">
          <span
            className="flex items-center gap-1.5 text-sm text-on-surface-variant"
            title={`Submitted at ${formatClockTime(item.submittedAt)}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              schedule
            </span>
            {formatRelativeTime(item.submittedAt)}
          </span>
          <ExamViolationBadge count={item.violationCount} />
          <span
            className="material-symbols-outlined text-on-surface-variant/50"
            style={{ fontSize: '20px' }}
          >
            chevron_right
          </span>
        </div>
      </div>

      {/* 메타 라인: 배정(생성) 시각 + 응시 소요 시간. 채점 판단의 보조 정보라 작게. */}
      <div className="flex items-center gap-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            event
          </span>
          Assigned {formatDateTimeShort(item.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            timer
          </span>
          Took {formatDuration(item.attemptStartedAt, item.submittedAt)}
        </span>
      </div>
    </button>
  );
}
