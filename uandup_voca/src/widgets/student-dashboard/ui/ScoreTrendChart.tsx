import React, { useState, useRef, useEffect } from 'react';
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
  label: string; // x축 라벨 'MM.DD'
  value: number; // y값 (점수 0~100 또는 단어 수)
  // dot 색상: true=합격, false=불합격, null=중립(학습량 차트)
  pass: boolean | null;
  // 툴팁 상세 — 시험 차트는 exam 목록, 학습량 차트는 단어 수.
  tooltip: { kind: 'exam'; exams: ExamScoreDetail[] } | { kind: 'count'; count: number };
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
    value: p.score,
    pass: p.isPassed,
    tooltip: { kind: 'exam', exams: p.exams },
  };
}

function countPointToChartPoint(p: LearnedCountPoint): ChartPoint {
  return {
    label: p.date,
    value: p.count,
    pass: null,
    tooltip: { kind: 'count', count: p.count },
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
      <p className="text-[11px] font-bold text-white/70 mb-1.5">{point.label}</p>
      {point.tooltip.kind === 'count' ? (
        <p className="text-sm font-bold">{point.tooltip.count} words learned</p>
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
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const xCount = points.length;
  const innerW = Math.max(containerWidth - MARGIN.left - MARGIN.right, (xCount - 1) * POINT_GAP);
  const width = innerW + MARGIN.left + MARGIN.right;

  function getX(index: number): number {
    return MARGIN.left + (xCount <= 1 ? innerW / 2 : (index / (xCount - 1)) * innerW);
  }
  function getY(v: number): number {
    return MARGIN.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  }

  const segments: React.ReactElement[] = [];
  for (let i = 1; i < points.length; i++) {
    segments.push(
      <line
        key={`seg-${i}`}
        x1={getX(i - 1)}
        y1={getY(points[i - 1].value)}
        x2={getX(i)}
        y2={getY(points[i].value)}
        stroke={PRIMARY}
        strokeWidth={2.5}
        strokeLinecap="round"
      />,
    );
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
        {points.map((p, i) => (
          <text
            key={`x-${i}`}
            x={getX(i)}
            y={MARGIN.top + innerH + 18}
            textAnchor="middle"
            fontSize={11}
            fontWeight={700}
            fill={AXIS_COLOR}
          >
            {p.label}
          </text>
        ))}
        {segments}
        {points.map((p, i) => {
          const color = p.pass === false ? FAIL_COLOR : PRIMARY;
          return (
            <g key={`dot-${i}`}>
              <text
                x={getX(i)}
                y={getY(p.value) - 10}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={color}
              >
                {p.value}
              </text>
              <circle
                cx={getX(i)}
                cy={getY(p.value)}
                r={4}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
              {/* 호버 히트 영역 — 작은 dot보다 넓게 잡아 마우스 인식을 쉽게 한다. */}
              <circle
                cx={getX(i)}
                cy={getY(p.value)}
                r={14}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        })}
      </svg>

      {hovered !== null && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            left: getX(hovered),
            top: getY(points[hovered].value) - 14,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <PointTooltip point={points[hovered]} />
        </div>
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
    points = charts.dailyLearnedCounts.map(countPointToChartPoint);
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
    points = exam.map(examPointToChartPoint);
    yMax = 100;
    yTicks = [20, 40, 60, 80, 100];
  }

  const chartWidth = size.width > 0 ? size.width - Y_AXIS_WIDTH : 0;

  return (
    <section className="col-span-8 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-headline">Score Trend</h2>
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

      <div ref={wrapperRef} className="h-84 flex">
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
