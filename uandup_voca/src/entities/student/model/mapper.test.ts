import { describe, it, expect } from 'vitest';
import {
  toStudentPickerRow,
  toUnassignedStudentRow,
  toStudentManageTableRow,
  toStudentDetail,
  toStudentOverview,
  toStudySetRow,
  toTestBundleRow,
  toStudentTestBundleRow,
  toStudentDashboard,
  toStudentDashboardCharts,
} from './mapper';
import type { StudySetRow } from './types';

// ── englishName 분리 로직 (3개 mapper 공통) ─────────────────────────────────

// ⚠️ NOTE: 학생/선생님 mapper와 clinic mapper의 영문명 파싱 규칙이 다르다.
// - 학생/선생님(이 파일): split(' ')[0]=first, [1]=last, 그 외는 버림 (e.g. "Min Su Kim" → first="Min", last="Su", "Kim" 손실)
// - clinic (entities/clinic/model/mapper.ts): last word=성, 그 외=이름 (e.g. "Min Su Kim" → first="Min Su", last="Kim")
// 둘 다 동일하게 작동해야 하는지 도메인 검토 필요. 현 동작을 lock in한다.
describe('englishName 파싱 — toStudentPickerRow / toStudentManageTableRow / toStudentDetail', () => {
  it('2-단어 영문명 — 첫 단어=first, 두 번째=last', () => {
    const row = toStudentPickerRow({ studentId: 1, englishName: 'Minsu Kim' });
    expect(row.nameFirstEn).toBe('Minsu');
    expect(row.nameLastEn).toBe('Kim');
  });

  it('3-단어 영문명 — split[0]=first, split[1]=last, 나머지는 버려진다 (현 구현)', () => {
    // 학생 mapper는 단순 destructuring을 써서 "Min Su Kim" 중 "Kim"이 손실된다.
    // 만약 clinic mapper와 동작을 일치시키려면 이 mapper도 수정 필요.
    const row = toStudentPickerRow({ studentId: 1, englishName: 'Min Su Kim' });
    expect(row.nameFirstEn).toBe('Min');
    expect(row.nameLastEn).toBe('Su');
  });

  it('단일 단어 영문명 — 첫 이름으로 들어가고 last는 빈 문자열', () => {
    const row = toStudentPickerRow({ studentId: 1, englishName: 'Minsu' });
    expect(row.nameFirstEn).toBe('Minsu');
    expect(row.nameLastEn).toBe('');
  });

  it('빈 영문명 — 둘 다 빈 문자열', () => {
    const row = toStudentPickerRow({ studentId: 1, englishName: '' });
    expect(row.nameFirstEn).toBe('');
    expect(row.nameLastEn).toBe('');
  });
});

// ── toStudentManageTableRow ─────────────────────────────────────────────────

describe('toStudentManageTableRow', () => {
  it('acr이 0~1 사이 비율이면 백분율 문자열로 변환된다 (0.87 → "87%")', () => {
    const row = toStudentManageTableRow({ studentId: 1, acr: 0.87 });
    expect(row.accuracy).toBe('87%');
  });

  it('acr이 null/undefined이면 accuracy는 undefined (시험 0건 의미)', () => {
    expect(toStudentManageTableRow({ studentId: 1 }).accuracy).toBeUndefined();
    expect(
      toStudentManageTableRow({ studentId: 1, acr: null as unknown as number }).accuracy,
    ).toBeUndefined();
  });

  it('acr 100% 정확히 (1.0 → "100%")', () => {
    expect(toStudentManageTableRow({ studentId: 1, acr: 1.0 }).accuracy).toBe('100%');
  });

  it('acr 반올림 (0.876 → "88%")', () => {
    expect(toStudentManageTableRow({ studentId: 1, acr: 0.876 }).accuracy).toBe('88%');
  });

  it('recentScore가 부분 정보만 있으면 null 처리 (score는 있고 total은 없음)', () => {
    expect(toStudentManageTableRow({ studentId: 1, recentScore: 80 }).recentScore).toBeNull();
  });

  it('recentScore와 recentScoreTotal이 모두 있을 때만 객체로 매핑', () => {
    const row = toStudentManageTableRow({ studentId: 1, recentScore: 80, recentScoreTotal: 100 });
    expect(row.recentScore).toEqual({ score: 80, total: 100 });
  });
});

// ── toUnassignedStudentRow ──────────────────────────────────────────────────

describe('toUnassignedStudentRow', () => {
  it('clinics 정보를 "DAY HOUR:00" 문자열 배열로 변환', () => {
    const row = toUnassignedStudentRow({
      studentId: 1,
      clinics: [
        { dayOfWeek: 'MON', hour: 13 },
        { dayOfWeek: 'WED', hour: 18 },
      ],
    });
    expect(row.clinics).toEqual(['MON 13:00', 'WED 18:00']);
  });

  it('clinics가 없으면 빈 배열', () => {
    expect(toUnassignedStudentRow({ studentId: 1 }).clinics).toEqual([]);
  });
});

// ── toStudentOverview ──────────────────────────────────────────────────────

describe('toStudentOverview', () => {
  it('latestMemo가 있으면 객체로 매핑', () => {
    const result = toStudentOverview({
      studentId: 1,
      latestMemo: { memoId: 10, date: '2026-05-01', content: 'note' },
    });
    expect(result.latestMemo).toEqual({ id: 10, date: '2026-05-01', content: 'note' });
  });

  it('latestMemo가 없으면 null', () => {
    expect(toStudentOverview({ studentId: 1 }).latestMemo).toBeNull();
  });

  it('alreadyAssigned 기본값은 false (서버가 안 보내면)', () => {
    expect(toStudentOverview({ studentId: 1 }).alreadyAssigned).toBe(false);
  });
});

// ── toTestBundleRow (teacher 시점, lock cascading) ──────────────────────────

const emptyStudySet: StudySetRow = {
  studySetId: 1,
  levels: [],
  wordCount: 0,
  assignedDate: '',
  word: null,
  example: null,
  review1: null,
  review2: null,
  review3: null,
};

describe('toTestBundleRow (teacher 시점)', () => {
  it('모든 step이 null이면 첫 step은 pending, 나머지는 locked', () => {
    const row = toTestBundleRow(emptyStudySet);
    expect(row.steps[0].status).toBe('pending');
    expect(row.steps.slice(1).every((s) => s.status === 'locked')).toBe(true);
  });

  it('이전 step이 passed면 다음 step이 잠금 해제된다 (cascading unlock)', () => {
    const row = toTestBundleRow({
      ...emptyStudySet,
      word: {
        examId: 1,
        status: 'COMPLETED',
        isPassed: true,
        createdAt: null,
        completedAt: null,
        correctCount: 10,
        totalCount: 10,
        scheduledDate: null,
      },
    });
    expect(row.steps[0].status).toBe('passed');
    expect(row.steps[1].status).toBe('pending'); // 다음 step은 잠금 해제됐지만 시험 아직 없음
    expect(row.steps[2].status).toBe('locked'); // 그 다음은 여전히 잠김
  });

  it('이전 step이 fail이면 다음 step은 잠긴 채 유지', () => {
    const row = toTestBundleRow({
      ...emptyStudySet,
      word: {
        examId: 1,
        status: 'COMPLETED',
        isPassed: false,
        createdAt: null,
        completedAt: null,
        correctCount: 5,
        totalCount: 10,
        scheduledDate: null,
      },
    });
    expect(row.steps[0].status).toBe('fail');
    expect(row.steps[1].status).toBe('locked');
  });

  it('READY status는 teacher 시점에서 active(선생님이 시작 가능)', () => {
    const row = toTestBundleRow({
      ...emptyStudySet,
      word: {
        examId: 1,
        status: 'READY',
        isPassed: null,
        createdAt: null,
        completedAt: null,
        correctCount: null,
        totalCount: null,
        scheduledDate: null,
      },
    });
    expect(row.steps[0].status).toBe('active');
  });

  it('ONLINE_STARTED, SUBMITTED는 grading 상태', () => {
    for (const status of ['ONLINE_STARTED', 'SUBMITTED']) {
      const row = toTestBundleRow({
        ...emptyStudySet,
        word: {
          examId: 1,
          status: status as never,
          isPassed: null,
          createdAt: null,
          completedAt: null,
          correctCount: null,
          totalCount: null,
          scheduledDate: null,
        },
      });
      expect(row.steps[0].status).toBe('grading');
    }
  });

  it('Step 이름이 순서대로 부여된다', () => {
    const row = toTestBundleRow(emptyStudySet);
    expect(row.steps.map((s) => s.name)).toEqual([
      'Word',
      'Sentence',
      'Review 1',
      'Review 2',
      'Review 3',
    ]);
  });
});

// ── toStudentTestBundleRow (student 시점, READY 해석 다름) ───────────────────

describe('toStudentTestBundleRow (student 시점)', () => {
  it('READY status는 student 시점에서 pending (선생님이 아직 시작 안 함)', () => {
    // teacher 매퍼와 달리 student는 READY를 응시 불가로 본다.
    const row = toStudentTestBundleRow({
      ...emptyStudySet,
      word: {
        examId: 1,
        status: 'READY',
        isPassed: null,
        createdAt: null,
        completedAt: null,
        correctCount: null,
        totalCount: null,
        scheduledDate: null,
      },
    });
    expect(row.steps[0].status).toBe('pending');
  });

  it('ONLINE_STARTED는 student 시점에서 active (응시 가능)', () => {
    const row = toStudentTestBundleRow({
      ...emptyStudySet,
      word: {
        examId: 1,
        status: 'ONLINE_STARTED',
        isPassed: null,
        createdAt: null,
        completedAt: null,
        correctCount: null,
        totalCount: null,
        scheduledDate: null,
      },
    });
    expect(row.steps[0].status).toBe('active');
  });

  it('SUBMITTED는 student 시점에서 grading', () => {
    const row = toStudentTestBundleRow({
      ...emptyStudySet,
      word: {
        examId: 1,
        status: 'SUBMITTED',
        isPassed: null,
        createdAt: null,
        completedAt: null,
        correctCount: null,
        totalCount: null,
        scheduledDate: null,
      },
    });
    expect(row.steps[0].status).toBe('grading');
  });
});

// ── toStudentDashboard ──────────────────────────────────────────────────────

describe('toStudentDashboard', () => {
  it('overallAccuracy가 0~1 비율이면 백분율 문자열 ("87%")', () => {
    expect(toStudentDashboard({ overallAccuracy: 0.87 }).overallAccuracy).toBe('87%');
  });

  it('overallAccuracy가 null이면 undefined (COMPLETED 시험 0건)', () => {
    expect(toStudentDashboard({}).overallAccuracy).toBeUndefined();
  });

  it('levelProgressPercent — memorizedIndex/totalCount 비율 (반올림)', () => {
    expect(
      toStudentDashboard({ levelMemorizedIndex: 50, levelTotalWordCount: 200 })
        .levelProgressPercent,
    ).toBe(25);
  });

  it('total이 0이면 levelProgressPercent도 0 (0으로 나누기 방어)', () => {
    expect(
      toStudentDashboard({ levelMemorizedIndex: 0, levelTotalWordCount: 0 }).levelProgressPercent,
    ).toBe(0);
  });

  it('currentLevel은 null 그대로 보존 (미배정 학생)', () => {
    expect(toStudentDashboard({}).currentLevel).toBeNull();
  });
});

// ── toStudentDashboardCharts ────────────────────────────────────────────────

describe('toStudentDashboardCharts', () => {
  it('빈 응답 — 모든 시리즈가 빈 배열', () => {
    const result = toStudentDashboardCharts({});
    expect(result.wordScores).toEqual([]);
    expect(result.exampleScores).toEqual([]);
    expect(result.reviewScores).toEqual([]);
    expect(result.dailyLearnedCounts).toEqual([]);
  });

  it('WORD/EXAMPLE — 시험 1건당 차트 1지점', () => {
    const result = toStudentDashboardCharts({
      wordExamScores: [
        { date: '2026-05-01', examId: 1, examType: 'WORD', accuracy: 0.8, isPassed: true },
        { date: '2026-05-02', examId: 2, examType: 'WORD', accuracy: 0.6, isPassed: false },
      ],
    });
    expect(result.wordScores).toHaveLength(2);
    expect(result.wordScores[0].score).toBe(80);
    expect(result.wordScores[0].date).toBe('05.01');
    expect(result.wordScores[1].isPassed).toBe(false);
  });

  it('REVIEW — 같은 날 여러 시험은 평균으로 합쳐진다', () => {
    const result = toStudentDashboardCharts({
      reviewExamScores: [
        { date: '2026-05-01', examId: 1, accuracy: 0.6, isPassed: true },
        { date: '2026-05-01', examId: 2, accuracy: 0.8, isPassed: true },
        { date: '2026-05-02', examId: 3, accuracy: 0.9, isPassed: true },
      ],
    });
    expect(result.reviewScores).toHaveLength(2);
    expect(result.reviewScores[0].date).toBe('05.01');
    expect(result.reviewScores[0].score).toBe(70); // (60 + 80) / 2
    expect(result.reviewScores[0].exams).toHaveLength(2);
  });

  it('REVIEW — 그날 모두 합격일 때만 isPassed=true (한 건이라도 fail이면 false)', () => {
    const result = toStudentDashboardCharts({
      reviewExamScores: [
        { date: '2026-05-01', examId: 1, accuracy: 0.6, isPassed: false },
        { date: '2026-05-01', examId: 2, accuracy: 0.8, isPassed: true },
      ],
    });
    expect(result.reviewScores[0].isPassed).toBe(false);
  });

  it('date "YYYY-MM-DD" → "MM.DD" 변환', () => {
    const result = toStudentDashboardCharts({
      wordExamScores: [{ date: '2026-12-31', examId: 1, accuracy: 1, isPassed: true }],
    });
    expect(result.wordScores[0].date).toBe('12.31');
  });

  it('exam 상세 — level/assignedWordCount는 null 보존 (StudySet 정보 없음)', () => {
    const result = toStudentDashboardCharts({
      wordExamScores: [
        {
          date: '2026-05-01',
          examId: 1,
          accuracy: 0.8,
          isPassed: true,
          level: null as never,
          assignedWordCount: null as never,
        },
      ],
    });
    expect(result.wordScores[0].exams[0].level).toBeNull();
    expect(result.wordScores[0].exams[0].assignedWordCount).toBeNull();
  });
});

// ── toStudentDetail (englishName 파싱과 testConfig 매핑 포함) ────────────────

describe('toStudentDetail', () => {
  it('parents/classrooms 빈 배열로 fallback', () => {
    const result = toStudentDetail({ studentId: 1 });
    expect(result.parents).toEqual([]);
    expect(result.classrooms).toEqual([]);
  });

  it('parents/classrooms 매핑', () => {
    const result = toStudentDetail({
      studentId: 1,
      parents: [{ parentId: 5, name: 'Mom', phoneNumber: '010' }],
      classrooms: [{ classId: 7, className: 'SAT' }],
    });
    expect(result.parents).toEqual([{ id: 5, name: 'Mom', phoneNumber: '010' }]);
    expect(result.classrooms).toEqual([{ id: 7, name: 'SAT' }]);
  });
});

// ── toStudySetRow ──────────────────────────────────────────────────────────

describe('toStudySetRow', () => {
  it('exams가 모두 누락되면 모두 null', () => {
    const row = toStudySetRow({ studySetId: 1 });
    expect(row.word).toBeNull();
    expect(row.example).toBeNull();
    expect(row.review1).toBeNull();
    expect(row.review2).toBeNull();
    expect(row.review3).toBeNull();
  });

  it('일부 exam만 있으면 그것만 매핑되고 나머지는 null', () => {
    const row = toStudySetRow({
      studySetId: 1,
      exams: { word: { examId: 10, status: 'COMPLETED' } },
    });
    expect(row.word).not.toBeNull();
    expect(row.word!.examId).toBe(10);
    expect(row.example).toBeNull();
  });

  it('LevelCount 배열이 그대로 매핑된다 (레벨 등업 케이스)', () => {
    const row = toStudySetRow({
      studySetId: 1,
      levels: [
        { level: 5, count: 30 },
        { level: 6, count: 20 },
      ],
    });
    expect(row.levels).toEqual([
      { level: 5, count: 30 },
      { level: 6, count: 20 },
    ]);
  });
});
