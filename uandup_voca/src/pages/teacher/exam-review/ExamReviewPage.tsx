import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams, useSearch, useNavigate } from '@tanstack/react-router';
import {
  ITEMS_PER_PAGE,
  type ExamType,
  type WordTestType,
  type StudySetExamType,
} from '@/entities/test';
import { AlertDialog } from '@/shared/ui/Modal';
import {
  TestPagination,
  ProgressPanel,
  VocabReviewTable,
  SentenceReviewTable,
} from '@/widgets/test-online';
import type { Answer } from '@/widgets/test-online';
import { useExamDetail, ExamViolationBadge } from '@/entities/test';
import { useStudentOverview, useActiveStudySetList, toTestBundleRow } from '@/entities/student';
import { toVocabReviewItems, toSentenceTestItems, toSentenceAnswers } from '@/entities/test';
import { useRecordOnlineResults } from './model/useRecordOnlineResults';
import { useCreateAndStartStepExam } from './model/useCreateAndStartStepExam';

// 선생님이 학생의 시험을 채점하거나 채점 결과를 확인하는 페이지(grading + result 통합).
// COMPLETED 상태로 진입 시 'result' 모드 — 채점 결과 표시. Edit 클릭으로 grading 재진입.
// 그 외 상태(ONLINE_STARTED/SUBMITTED 등)로 진입 시 'grading' 모드 — 오답 체크 → Save.
// examType === 'EXAMPLE'은 문장 시험, 그 외는 단어 시험.

type ReviewMode = 'grading' | 'result';

// step 시험 타입 순서 — toTestBundleRow의 steps 순서와 일치(도메인이 순서로 examType↔step을 잇는다).
// examType으로 해당 step을 인덱싱하는 데 쓴다. entities mapper의 STEP_EXAM_TYPES가 export되지 않아
// 페이지에서 복제한다(ClinicCycleRow/WordTestCycleRow의 기존 관례와 동일).
const STEP_EXAM_TYPES: StudySetExamType[] = ['WORD', 'EXAMPLE', 'REVIEW1', 'REVIEW2', 'REVIEW3'];

export default function ExamReviewPage() {
  const { examId: examIdParam } = useParams({ from: '/teacher_/exams/$examId/review' });
  const search = useSearch({ from: '/teacher_/exams/$examId/review' });
  const router = useRouter();
  const navigate = useNavigate();

  const routeExamId = Number(examIdParam);

  // allExamIds가 있으면 탭 전환 뷰. "examId:score:P/F,..." 형식 → { examId, score, isPassed }[].
  const examAttempts: { examId: number; score: string; isPassed: boolean }[] = useMemo(() => {
    if (!search.allExamIds) return [];
    return search.allExamIds
      .split(',')
      .map((part) => {
        const parts = part.split(':');
        const examId = Number(parts[0]);
        const score = parts[1] ?? '-';
        const isPassed = parts[2] === 'P';
        return { examId, score, isPassed };
      })
      .filter((a) => !isNaN(a.examId) && a.examId > 0);
  }, [search.allExamIds]);

  const showAttemptTabs = examAttempts.length > 1;
  const [selectedExamId, setSelectedExamId] = useState(routeExamId);
  const examId = showAttemptTabs ? selectedExamId : routeExamId;

  const { data: examDetail, isLoading } = useExamDetail(examId);

  // ExamDetail에는 학생 식별 정보가 없다 — 헤더에 이름/학년을 띄우려면 별도로 overview를 가져온다.
  // studentId가 없는 URL(북마크/수기 입력)에서는 hook 내부의 enabled 가드가 요청을 막는다.
  const studentId = search.studentId ?? 0;
  const { data: student } = useStudentOverview(studentId);

  const examType: ExamType = (search.examType ?? 'WORD') as ExamType;
  const isSentence = examType === 'EXAMPLE';

  const studySetId = search.studySetId ?? 0;

  const recordResults = useRecordOnlineResults({
    examId,
    studentId,
    studySetId,
    examType,
  });

  // 현재 채점 중인 시험이 step 시험(WORD/EXAMPLE/REVIEW1~3)인지. REVIEW_DECK/LEVEL_TEST면 -1/null.
  const stepIndex = STEP_EXAM_TYPES.indexOf(examType as StudySetExamType);
  const stepExamType: StudySetExamType | null =
    stepIndex >= 0 ? (examType as StudySetExamType) : null;

  // 예문 배정(WORD Pass 후 EXAMPLE) / 재시험(현재 단계 Fail 후 같은 단계) — 둘 다 생성+응시개시.
  const assignSentence = useCreateAndStartStepExam({ studentId, studySetId, examType: 'EXAMPLE' });
  const retake = useCreateAndStartStepExam({
    studentId,
    studySetId,
    examType: stepExamType ?? 'WORD', // stepExamType null이면 버튼이 렌더되지 않아 실제로 쓰이지 않음
  });

  // 이 StudySet의 배정 단어 수(문항 수 상한)와 step 상태를 얻기 위해 active 목록을 조회한다.
  // 채점 직후 studentKeys.studySets가 invalidate되므로 캐시가 대체로 따뜻하다.
  const { data: studySets } = useActiveStudySetList(studentId);
  const studySetRow = useMemo(
    () => studySets?.find((r) => r.studySetId === studySetId),
    [studySets, studySetId],
  );
  // lock/pending/fail 계산은 toTestBundleRow의 prevPassed 체인을 그대로 재사용.
  // examType↔step은 순서로 대응하므로 STEP_EXAM_TYPES 인덱스로 조회한다.
  const bundleSteps = useMemo(
    () => (studySetRow ? toTestBundleRow(studySetRow).steps : null),
    [studySetRow],
  );
  const sentenceStep = bundleSteps?.[STEP_EXAM_TYPES.indexOf('EXAMPLE')] ?? null; // 다음 단계(예문)
  const gradedStep = stepIndex >= 0 ? (bundleSteps?.[stepIndex] ?? null) : null; // 현재 채점 중인 단계

  const [currentPage, setCurrentPage] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<ReviewMode>('grading');
  const [isEditing, setIsEditing] = useState(false);
  // 합격 여부는 선생님이 명시적으로 선택. 채점 완료된 시험으로 재진입 시 기존 값으로 초기화.
  const [outcome, setOutcome] = useState<'pass' | 'fail'>('pass');
  const [showGradingSuccess, setShowGradingSuccess] = useState(false);
  const [showAssignSuccess, setShowAssignSuccess] = useState(false);
  const [showRetakeSuccess, setShowRetakeSuccess] = useState(false);

  // examDetail 로드 시 초기 상태 동기화 — 이미 채점된 시험이면 result 모드 + 기존 오답/합격 표시.
  // wrongIds는 itemOrder를 키로 추적한다(row id와 일치). 채점 mutation을 보낼 땐 examItemId로 다시 매핑.
  useEffect(() => {
    if (!examDetail) return;
    if (examDetail.status === 'COMPLETED') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode('result');
      setWrongIds(
        new Set(examDetail.items.filter((i) => i.isCorrect === false).map((i) => i.itemOrder)),
      );
      setOutcome(examDetail.isPassed === true ? 'pass' : 'fail');
    } else {
      setMode('grading');
      setWrongIds(new Set());
    }
  }, [examDetail]);

  const handleToggleWrong = useCallback((id: number) => {
    setWrongIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  function handleExit() {
    if (search.returnTo) {
      router.history.replace(search.returnTo);
    } else {
      router.history.back();
    }
  }

  // 채점 후 해당 학생의 단어 번들 화면으로 이동. Exit(returnTo)은 채점 큐에서 진입했을 때
  // 큐로만 돌아가므로, 학생 진도를 바로 확인할 경로를 별도로 연다.
  // replace로 채점 화면을 스택에서 치운다 — push면 뒤로가기가 방금 나온 채점 화면으로 되돌아간다.
  function handleGoToStudentSets() {
    navigate({
      to: '/teacher/clinics/students/$studentId',
      params: { studentId: String(studentId) },
      replace: true,
    });
  }

  // 예문 시험 생성+응시개시. 성공 시 알림만 띄우고 머무른다(버튼은 step 상태 변화로 저절로 사라짐).
  function handleAssignSentence() {
    assignSentence.mutate(undefined, {
      onSuccess: () => setShowAssignSuccess(true),
    });
  }

  // 재시험 생성+응시개시. 성공 시 알림만 띄우고 머무른다(버튼은 gradedStep 상태 변화로 저절로 사라짐).
  function handleRetake() {
    retake.mutate(undefined, {
      onSuccess: () => setShowRetakeSuccess(true),
    });
  }

  function handleSaveResults() {
    if (!examDetail) return;
    // wrongIds는 itemOrder 기준 — examItemId로 매핑해 API 페이로드를 만든다.
    const results = examDetail.items.map((item) => ({
      examItemId: item.examItemId,
      isCorrect: !wrongIds.has(item.itemOrder),
      userAnswer: item.userAnswer ?? '',
    }));
    recordResults.mutate(
      { results, isPassed: outcome === 'pass' },
      {
        onSuccess: () => {
          setMode('result');
          setIsEditing(false);
          setShowGradingSuccess(true);
          // 탭이 있으면 URL의 allExamIds를 새 점수로 갱신 — 탭 전환 후에도 최신 점수 유지.
          if (showAttemptTabs) {
            const newScore = `${totalItems - wrongIds.size}/${totalItems}`;
            const pf = outcome === 'pass' ? 'P' : 'F';
            const updatedAllExamIds = examAttempts
              .map((a) =>
                a.examId === selectedExamId
                  ? `${a.examId}:${newScore}:${pf}`
                  : `${a.examId}:${a.score}:${a.isPassed ? 'P' : 'F'}`,
              )
              .join(',');
            navigate({
              to: '/teacher/exams/$examId/review',
              params: { examId: examIdParam },
              search: { ...search, allExamIds: updatedAllExamIds },
              replace: true,
            });
          }
        },
      },
    );
  }

  // VocabReviewRow가 사용하는 answers map — row.id(itemOrder)로 lookup하므로 itemOrder를 키로 한다.
  const vocabAnswers: Record<number, Answer> = useMemo(() => {
    if (!examDetail) return {};
    return Object.fromEntries(
      examDetail.items.map((item) => [
        item.itemOrder,
        {
          answer: item.userAnswer ?? '',
          synonym: item.synonymUserAnswers.join(', '),
        },
      ]),
    );
  }, [examDetail]);

  if (isLoading || !examDetail) {
    return <></>;
  }

  const testType: WordTestType = examDetail.subType ?? 'word-to-meaning';
  const showSynonym = examDetail.includeSynonym;

  const vocabItems = !isSentence ? toVocabReviewItems(examDetail.items) : [];
  const sentenceItems = isSentence ? toSentenceTestItems(examDetail.items) : [];
  const sentenceAnswers = isSentence ? toSentenceAnswers(examDetail.items) : {};

  const totalItems = isSentence ? sentenceItems.length : vocabItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const vocabPageItems = vocabItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const sentencePageItems = sentenceItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const allIds = isSentence ? sentenceItems.map((i) => i.id) : vocabItems.map((i) => i.id);
  const checkedIds = new Set<number>(allIds);
  const correctCount = totalItems - wrongIds.size;
  const hideCheckbox = mode === 'result';

  // ── 예문 시험 배정 버튼 노출 판정 ─────────────────────────────────────────
  // 서버는 "단어 시험 미통과" 상태에서 EXAMPLE 생성을 막지 않으므로(잠금은 클라이언트 계산)
  // outcome === 'pass' 가드가 잘못된 배정을 막는 유일한 방어선이다.
  const sentenceStatus = sentenceStep?.status;
  const canAssignSentence =
    examType === 'WORD' &&
    mode === 'result' &&
    outcome === 'pass' &&
    selectedExamId === routeExamId &&
    // 'pending' = 배정 가능. 'locked'도 허용하는 이유: 채점 직후 studySets refetch 전 낡은 캐시는
    // 아직 WORD 미통과 상태라 Sentence를 locked로 계산한다. outcome==='pass'로 이미 걸렀으므로
    // 이 locked는 stale일 뿐 — 허용하지 않으면 버튼이 잠깐 사라졌다 나타나며 깜빡인다.
    (sentenceStatus === 'pending' || sentenceStatus === 'locked');

  // ── 재시험 버튼 노출 판정 ─────────────────────────────────────────────────
  // 예문(Pass)과 달리 서버 상태(gradedStep.status === 'fail')를 유일 신호로 쓴다.
  // create+start 후 단계가 fail→grading으로 바뀌므로 === 'fail'만 보면 (i) 재시험 생성 즉시 버튼이
  // 사라지고 (ii) 이미 재시험이 있는 fail 시험을 재방문해도 안 뜬다(중복 생성/EXAM_ALREADY_ACTIVE 방지).
  // 채점 직후 stale 구간은 "Grading Complete!" 성공 모달이 가려 깜빡임이 없다.
  const canRetake =
    stepExamType !== null &&
    mode === 'result' &&
    selectedExamId === routeExamId &&
    gradedStep?.status === 'fail';

  // 문항 수 가드 — 서버가 EXAM_QUESTION_COUNT_EXCEEDS_ASSIGNED로 거부하는 케이스를 미리 막는다.
  // testQty는 학생 프로필 값, 상한은 이 StudySet의 배정 단어 수. 예문 배정·재시험이 공유한다.
  const assignableTestQty = student?.testQuestionCount ?? 0;
  const assignableMaxQty = studySetRow?.wordCount ?? 0;
  const assignableQtyInvalid = assignableTestQty === 0 || assignableTestQty > assignableMaxQty;
  const assignableQtyReason =
    assignableTestQty === 0
      ? 'Set the question count in the student settings first.'
      : `Question count (${assignableTestQty}) exceeds this set's assigned words (${assignableMaxQty}).`;

  // sentence review용 정답 단어 map — examItem.word가 빈칸을 채울 정답.
  const sentenceCorrectAnswers: Record<number, string> = Object.fromEntries(
    examDetail.items.map((item) => [item.itemOrder, item.word]),
  );

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-outline-variant/30 px-6 h-16 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <button
            onClick={handleExit}
            className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              logout
            </span>
            Exit
          </button>
        </div>

        {/* 헤더 중앙 그룹 — 채점 대상 학생 + (복수 시도 탭 | 점수 텍스트) + 위반 횟수 뱃지.
            좌우가 flex-1이라 이 그룹 전체가 헤더 정중앙에 정렬된다. */}
        <div className="flex items-center gap-2">
          {/* 채점 대상 학생. 로딩 중이거나 studentId가 없으면 통째로 생략한다. */}
          {student && (
            <>
              <span className="text-sm font-bold text-on-surface whitespace-nowrap">
                {student.nameKo} · G{student.grade}
              </span>
              <span className="w-px h-4 bg-outline-variant/40 mx-1" />
            </>
          )}

          {/* 복수 시도 탭 — 각 탭에 점수 + Pass/Fail 뱃지 표시.
              선택된 탭은 URL 고정값 대신 examDetail 실시간 데이터로 오버라이드한다. */}
          {showAttemptTabs ? (
            <div className="flex items-center gap-2">
              {examAttempts.map((attempt) => {
                const isSelected = selectedExamId === attempt.examId;
                // 선택된 탭이 result 모드이면 live 데이터 사용 — 채점 수정 후 즉시 반영.
                const liveScore =
                  isSelected && mode === 'result' ? `${correctCount}/${totalItems}` : attempt.score;
                const liveIsPassed =
                  isSelected && mode === 'result' ? outcome === 'pass' : attempt.isPassed;

                return (
                  <button
                    key={attempt.examId}
                    onClick={() => setSelectedExamId(attempt.examId)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
                    }`}
                  >
                    {liveScore}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : liveIsPassed
                            ? 'bg-success/10 text-success'
                            : 'bg-error/10 text-error'
                      }`}
                    >
                      {liveIsPassed ? 'P' : 'F'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* 단일 시도 — 점수/결과 텍스트 표시 */
            <div className="flex items-center gap-2">
              {mode === 'result' ? (
                <>
                  <span className="text-sm font-bold text-on-surface">
                    {correctCount} / {totalItems} correct
                  </span>
                  <span className="text-on-surface-variant/30">·</span>
                  <span
                    className={`text-sm font-bold ${outcome === 'pass' ? 'text-success' : 'text-error'}`}
                  >
                    {outcome === 'pass' ? 'Passed' : 'Failed'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-on-surface">
                    {correctCount} / {totalItems}
                  </span>
                  <span className="text-on-surface-variant/30">·</span>
                  <span className="text-sm text-error font-semibold">{wrongIds.size} wrong</span>
                </>
              )}
            </div>
          )}

          {/* 응시 중 화면 이탈 횟수. 복수 시도일 땐 선택된 탭(examDetail)의 값을 따라간다.
              탭 분기 바깥에 두어야 복수 시도에서도 사라지지 않는다. */}
          <ExamViolationBadge count={examDetail.violationCount} />
        </div>

        <div className="flex-1 flex justify-end items-center gap-3">
          {mode === 'grading' && (
            // Pass/Fail segmented toggle — isPassed로 mutation에 전달된다.
            <div
              role="radiogroup"
              aria-label="Outcome"
              className="flex items-center rounded-lg border border-outline-variant/30 overflow-hidden"
            >
              <button
                role="radio"
                aria-checked={outcome === 'pass'}
                onClick={() => setOutcome('pass')}
                className={`px-3 py-2 text-sm font-bold transition-colors ${
                  outcome === 'pass'
                    ? 'bg-success text-white'
                    : 'bg-white text-on-surface-variant hover:bg-slate-50'
                }`}
              >
                Pass
              </button>
              <button
                role="radio"
                aria-checked={outcome === 'fail'}
                onClick={() => setOutcome('fail')}
                className={`px-3.5 py-2 text-sm font-bold transition-colors border-l border-outline-variant/30 ${
                  outcome === 'fail'
                    ? 'bg-error text-white'
                    : 'bg-white text-on-surface-variant hover:bg-slate-50'
                }`}
              >
                Fail
              </button>
            </div>
          )}

          {mode === 'grading' ? (
            <button
              onClick={handleSaveResults}
              disabled={recordResults.isPending}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {isEditing ? 'save' : 'grade'}
              </span>
              {isEditing ? 'Save' : 'Grade'}
            </button>
          ) : (
            <>
              {/* 예문 시험 바로 배정 — WORD를 Pass로 채점한 직후에만 노출(canAssignSentence).
                  문항 수 가드에 걸리면 비활성 + 사유 툴팁. 성공하면 step 상태 전환으로 저절로 사라진다. */}
              {canAssignSentence && (
                <button
                  onClick={handleAssignSentence}
                  disabled={assignSentence.isPending || assignableQtyInvalid}
                  title={assignableQtyInvalid ? assignableQtyReason : undefined}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    assignment_add
                  </span>
                  {assignSentence.isPending ? 'Assigning...' : 'Assign Sentence Test'}
                </button>
              )}

              {/* 재시험 바로 생성 — 현재 단계를 Fail로 채점한 직후에만 노출(canRetake).
                  예문 버튼과 outcome이 반대라 동시에 뜰 일이 없다. 성공하면 저절로 사라진다. */}
              {canRetake && (
                <button
                  onClick={handleRetake}
                  disabled={retake.isPending || assignableQtyInvalid}
                  title={assignableQtyInvalid ? assignableQtyReason : undefined}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors bg-error/10 text-error border border-error/30 hover:bg-error/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    replay
                  </span>
                  {retake.isPending ? 'Assigning...' : 'Retake Test'}
                </button>
              )}

              {/* 학생 단어 번들 바로가기. studentId 없는 URL이면 /students/0으로 깨지므로 렌더 안 함.
                  Edit과 형제로 두어 과거 시도 탭(Edit 숨김) 상태에서도 남아 있게 한다. */}
              {studentId > 0 && (
                <button
                  onClick={handleGoToStudentSets}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:text-primary"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    library_books
                  </span>
                  Go to Clinic
                </button>
              )}

              {/* 과거 시도(selectedExamId !== routeExamId)는 수정 불가 — Edit 버튼 숨김. */}
              {selectedExamId === routeExamId && (
                <button
                  onClick={() => {
                    setMode('grading');
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    edit
                  </span>
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </header>

      <div className="relative flex-1 overflow-x-auto px-6 py-6">
        <div className="w-240 mx-auto flex flex-col gap-4">
          {isSentence ? (
            <SentenceReviewTable
              items={sentencePageItems}
              answers={sentenceAnswers}
              correctAnswers={sentenceCorrectAnswers}
              wrongIds={wrongIds}
              readOnly={mode === 'result'}
              hideCheckbox={hideCheckbox}
              onToggleWrong={handleToggleWrong}
            />
          ) : (
            <VocabReviewTable
              items={vocabPageItems}
              testType={testType}
              showSynonym={showSynonym}
              answers={vocabAnswers}
              wrongIds={wrongIds}
              readOnly={mode === 'result'}
              hideCheckbox={hideCheckbox}
              onToggleWrong={handleToggleWrong}
            />
          )}

          <TestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <ProgressPanel
          questionIds={allIds}
          completedCount={checkedIds.size}
          remainingCount={totalItems - checkedIds.size}
          completedIds={checkedIds}
          wrongIds={wrongIds}
          mode="review"
          onQuestionClick={setCurrentPage}
        />
      </div>

      {/* 채점 완료 알림 — 점수와 합격 여부를 한눈에 확인한다. */}
      {showGradingSuccess && (
        <AlertDialog
          variant="success"
          title="Grading Complete!"
          description={`${correctCount} / ${totalItems} correct · ${outcome === 'pass' ? 'Passed' : 'Failed'}`}
          onClose={() => setShowGradingSuccess(false)}
        />
      )}

      {/* 예문 시험 배정 완료 알림 — 생성+응시개시까지 끝나 학생이 바로 응시할 수 있음을 안내. */}
      {showAssignSuccess && (
        <AlertDialog
          variant="success"
          title="Sentence Test Assigned"
          description="The sentence test is now live — the student can start it right away."
          onClose={() => setShowAssignSuccess(false)}
        />
      )}

      {/* 재시험 생성 완료 알림 — 생성+응시개시까지 끝나 학생이 바로 재응시할 수 있음을 안내. */}
      {showRetakeSuccess && (
        <AlertDialog
          variant="success"
          title="Retake Assigned"
          description="The retake is now live — the student can start it right away."
          onClose={() => setShowRetakeSuccess(false)}
        />
      )}
    </div>
  );
}
