import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type {
  StudentDashboardCharts,
  ExamScorePoint,
  ExamScoreDetail,
  LearnedCountPoint,
} from '@/entities/student';

interface Props {
  charts: StudentDashboardCharts;
}

type TabType = 'word' | 'sentence' | 'review' | 'monthly';

// 차트 렌더링에 쓰는 통합 지점 모델 — 시험 차트·학습량 차트를 한 모델로 다룬다.
interface ChartPoint {
  label: string; // x축 라벨 'MM.DD' or 'May'
  // x축 슬롯 인덱스. 같은 날짜의 시험은 같은 값을 공유해 같은 x 위치에 표시된다.
  dateIndex: number;
  value: number; // y값 (점수 0~100 또는 단어 수)
  // dot 색상 / 선 연결 규칙: true=합격(pass끼리만 연결), false=빨간 단독 점, null=중립(학습량 차트, 전부 연결)
  pass: boolean | null;
  // 툴팁 상세 — 시험 차트는 exam 목록, 학습량 차트는 월 합계 + 일별 상세.
  tooltip:
    | { kind: 'exam'; exams: ExamScoreDetail[] }
    | { kind: 'count'; count: number; dailyDetails: { date: string; count: number }[] };
}

const EXAM_TYPE_LABEL: Record<ExamScoreDetail['examType'], string> = {
  WORD: 'Word',
  EXAMPLE: 'Sentence',
  REVIEW1: 'Review 1',
  REVIEW2: 'Review 2',
  REVIEW3: 'Review 3',
};

function examPointToChartPoint(p: ExamScorePoint): ChartPoint {
  return {
    label: p.date,
    dateIndex: p.dateIndex,
    value: p.score,
    pass: p.isPassed,
    tooltip: { kind: 'exam', exams: p.exams },
  };
}

// index를 dateIndex로 사용한다 — 월별 집계 결과는 항상 고유 x 위치를 가진다.
function countPointToChartPoint(p: LearnedCountPoint, index: number): ChartPoint {
  return {
    label: p.date,
    dateIndex: index,
    value: p.count,
    pass: null,
    tooltip: { kind: 'count', count: p.count, dailyDetails: p.dailyDetails },
  };
}

// 학습량 차트의 y축 최댓값 — 데이터 최대치를 100 단위로 올림(최소 100).
function roundUpToHundred(max: number): number {
  return Math.max(100, Math.ceil(max / 100) * 100);
}

const tabs: { key: TabType; label: string }[] = [
  { key: 'word', label: 'Word' },
  { key: 'sentence', label: 'Sentence' },
  { key: 'review', label: 'Review' },
  { key: 'monthly', label: 'Learned Words' },
];

const MARGIN = { top: 24, right: 24, bottom: 32, left: 20 };
const Y_AXIS_WIDTH = 40;
const POINT_GAP = 60;
const PRIMARY = 'var(--color-primary)';
const FAIL_COLOR = '#ef4444';
const AXIS_COLOR = 'var(--color-on-surface-variant)';
const GRID_COLOR = 'rgba(0,0,0,0.06)';

function YAxis({
  height,
  yMin,
  yMax,
  yTicks,
}: {
  height: number;
  yMin: number;
  yMax: number;
  yTicks: number[];
}) {
  const innerH = height - MARGIN.top - MARGIN.bottom;
  function getY(v: number) {
    return MARGIN.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  }
  return (
    <svg width={Y_AXIS_WIDTH} height={height} style={{ flexShrink: 0 }}>
      {yTicks.map((tick) => (
        <text
          key={tick}
          x={Y_AXIS_WIDTH - 6}
          y={getY(tick)}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={11}
          fill={AXIS_COLOR}
        >
          {tick}
        </text>
      ))}
    </svg>
  );
}

// 호버된 지점의 툴팁. 시험 차트는 각 시험의 레벨·배정 단어 수·점수·합격 여부를 보여준다.
// REVIEW 차트는 같은 날 여러 시험이 한 지점에 모이므로 exams 배열을 모두 나열한다.
function PointTooltip({ point }: { point: ChartPoint }) {
  return (
    <div className="rounded-lg bg-on-surface px-3 py-2 shadow-lg text-white min-w-48">
      {point.tooltip.kind === 'count' ? (
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-bold">{point.tooltip.count} words learned</p>
          {point.tooltip.dailyDetails.length > 0 && (
            <div className="border-t border-white/15 pt-1.5 flex flex-col gap-0.5">
              {point.tooltip.dailyDetails.map((d) => (
                <div key={d.date} className="flex justify-between gap-4 text-xs text-white/70">
                  <span>{d.date}</span>
                  <span className="font-semibold text-white/90">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 [&>div+div]:border-t [&>div+div]:border-white/15 [&>div+div]:pt-2">
          {point.tooltip.exams.map((e) => (
            <div key={e.examId} className="flex flex-col gap-0.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold">{EXAM_TYPE_LABEL[e.examType]}</span>
                <span className={e.isPassed ? 'text-green-300' : 'text-red-300'}>
                  {e.isPassed ? 'Pass' : 'Fail'}
                </span>
              </div>
              {/* 레벨·배정 단어 수는 서버가 StudySet 정보를 못 찾으면 null로 내려와 '—'로 표시한다. */}
              <div className="text-white/70">
                Level {e.level ?? '—'} · {e.assignedWordCount ?? '—'} words assigned
              </div>
              <div className="text-white/80">
                Score {e.correctCount}/{e.totalCount} ({e.accuracy}%)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartBody({
  points,
  containerWidth,
  height,
  yMin,
  yMax,
  yTicks,
}: {
  points: ChartPoint[];
  containerWidth: number;
  height: number;
  yMin: number;
  yMax: number;
  yTicks: number[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  // 툴팁을 portal로 렌더하기 위해 viewport 기준 좌표를 저장한다.
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const innerH = height - MARGIN.top - MARGIN.bottom;

  // x축 슬롯 수 = 고유 dateIndex 수. 같은 날짜의 시험이 여러 개여도 x 위치는 1개다.
  const uniqueXCount = points.length === 0 ? 0 : Math.max(...points.map((p) => p.dateIndex)) + 1;
  const innerW = Math.max(
    containerWidth - MARGIN.left - MARGIN.right,
    (uniqueXCount - 1) * POINT_GAP,
  );
  const width = innerW + MARGIN.left + MARGIN.right;

  function getX(dateIndex: number): number {
    return (
      MARGIN.left + (uniqueXCount <= 1 ? innerW / 2 : (dateIndex / (uniqueXCount - 1)) * innerW)
    );
  }
  function getY(v: number): number {
    return MARGIN.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  }

  // 선 연결 규칙:
  //   - 학습량·Review 차트(pass=null): 모든 dateIndex 슬롯을 순서대로 연결.
  //   - Word·Sentence 차트: 각 dateIndex 슬롯의 "대표 pass 점"끼리만 연결.
  //     대표 = 해당 슬롯의 마지막 pass 점. fail-only 슬롯은 대표 없음 → 선 끊김.
  //     같은 슬롯에 fail+pass가 함께 있을 때 fail은 단독 빨간 점, pass는 대표로 선 연결.
  const segments: React.ReactElement[] = [];
  {
    // dateIndex 슬롯별 대표 점 계산
    const slotRep = new Map<number, ChartPoint>();
    for (const p of points) {
      if (p.pass === null) {
        // monthly/review: 항상 대표 (슬롯당 1개이므로 덮어쓰기 무해)
        slotRep.set(p.dateIndex, p);
      } else if (p.pass === true) {
        // 같은 슬롯에 여러 pass가 있으면 마지막(배열 끝)이 덮어쓴다
        slotRep.set(p.dateIndex, p);
      }
      // pass === false: 대표가 되지 않는다 — 선 없이 단독 빨간 점
    }

    const dateIndices = [...new Set(points.map((p) => p.dateIndex))].sort((a, b) => a - b);
    for (let i = 1; i < dateIndices.length; i++) {
      const prevRep = slotRep.get(dateIndices[i - 1]);
      const currRep = slotRep.get(dateIndices[i]);
      if (!prevRep || !currRep) continue; // 어느 쪽이든 대표가 없으면(fail-only 슬롯) 선 끊김
      segments.push(
        <line
          key={`seg-${i}`}
          x1={getX(prevRep.dateIndex)}
          y1={getY(prevRep.value)}
          x2={getX(currRep.dateIndex)}
          y2={getY(currRep.value)}
          stroke={PRIMARY}
          strokeWidth={2.5}
          strokeLinecap="round"
        />,
      );
    }
  }

  return (
    <div className="relative" style={{ width }}>
      <svg width={width} height={height}>
        {yTicks.map((tick) => (
          <line
            key={tick}
            x1={MARGIN.left}
            y1={getY(tick)}
            x2={MARGIN.left + innerW}
            y2={getY(tick)}
            stroke={GRID_COLOR}
            strokeDasharray="3 3"
          />
        ))}
        {/* x축 라벨 — dateIndex가 처음 등장하는 점에서만 렌더해 같은 날짜 중복 방지 */}
        {points.map((p, i) =>
          i === 0 || points[i - 1].dateIndex !== p.dateIndex ? (
            <text
              key={`x-${i}`}
              x={getX(p.dateIndex)}
              y={MARGIN.top + innerH + 18}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill={AXIS_COLOR}
            >
              {p.label}
            </text>
          ) : null,
        )}
        {segments}
        {points.map((p, i) => {
          const color = p.pass === false ? FAIL_COLOR : PRIMARY;
          return (
            <g key={`dot-${i}`}>
              <text
                x={getX(p.dateIndex)}
                y={getY(p.value) - 10}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={color}
              >
                {p.value}
              </text>
              <circle
                cx={getX(p.dateIndex)}
                cy={getY(p.value)}
                r={4}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
              {/* 호버 히트 영역 — 작은 dot보다 넓게 잡아 마우스 인식을 쉽게 한다. */}
              <circle
                cx={getX(p.dateIndex)}
                cy={getY(p.value)}
                r={14}
                fill="transparent"
                onMouseEnter={(e) => {
                  setHovered(i);
                  // 툴팁을 portal로 렌더하기 위해 히트 원의 viewport 좌표를 기록한다.
                  const rect = (e.target as SVGCircleElement).getBoundingClientRect();
                  setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  setTooltipPos(null);
                }}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        })}
      </svg>

      {/* 툴팁을 document.body에 portal로 렌더 — scrollRef의 overflow-x:auto 클리핑을 우회한다. */}
      {hovered !== null &&
        tooltipPos !== null &&
        ReactDOM.createPortal(
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, calc(-100% - 8px))',
            }}
          >
            <PointTooltip point={points[hovered]} />
          </div>,
          document.body,
        )}
    </div>
  );
}

export function ScoreTrendChart({ charts }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('word');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
  }, [activeTab, size.width]);

  // 탭별 차트 지점 + y축 구성.
  let points: ChartPoint[];
  let yMax: number;
  let yTicks: number[];
  if (activeTab === 'monthly') {
    points = charts.dailyLearnedCounts.map((p, i) => countPointToChartPoint(p, i));
    yMax = roundUpToHundred(Math.max(0, ...points.map((p) => p.value)));
    const step = yMax / 4;
    yTicks = [step, step * 2, step * 3, yMax];
  } else {
    const exam =
      activeTab === 'word'
        ? charts.wordScores
        : activeTab === 'sentence'
          ? charts.exampleScores
          : charts.reviewScores;
    // Review 탭: 점은 항상 primary 색(pass=null). fail 여부를 색으로 구분하지 않고
    // 모든 점이 연결된다. tooltip의 개별 시험 pass/fail 정보는 exams 배열에 보존.
    points = exam.map((p) => ({
      ...examPointToChartPoint(p),
      pass: activeTab === 'review' ? null : (p.isPassed as boolean),
    }));
    yMax = 100;
    yTicks = [20, 40, 60, 80, 100];
  }

  const chartWidth = size.width > 0 ? size.width - Y_AXIS_WIDTH : 0;

  return (
    <section className="col-span-8 bg-surface-container-lowest p-5 xl:p-8 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4 xl:mb-6">
        <h2 className="text-base xl:text-xl font-bold font-headline">Score Trend</h2>
        <div className="flex gap-1 bg-surface-container rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all
                ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={wrapperRef} className="h-64 xl:h-84 flex">
        {size.height > 0 && <YAxis height={size.height} yMin={0} yMax={yMax} yTicks={yTicks} />}
        <div ref={scrollRef} className="flex-1 overflow-x-auto">
          {points.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-on-surface-variant">
              No exam data yet.
            </div>
          ) : (
            chartWidth > 0 &&
            size.height > 0 && (
              <ChartBody
                key={activeTab}
                points={points}
                containerWidth={chartWidth}
                height={size.height}
                yMin={0}
                yMax={yMax}
                yTicks={yTicks}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
