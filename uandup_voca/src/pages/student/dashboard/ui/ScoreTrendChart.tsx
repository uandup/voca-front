import React, { useState, useRef, useEffect } from 'react';

interface ExamResult {
  label: string;
  value: number;
  pass: boolean;
}

interface DataPoint {
  label: string;
  value: number;
}

const wordResults: ExamResult[] = [
  { label: '02.03', value: 80, pass: true },
  { label: '02.10', value: 85, pass: true },
  { label: '02.17', value: 55, pass: false },
  { label: '02.17', value: 82, pass: true }, // 재시험 합격
  { label: '02.24', value: 90, pass: true },
  { label: '03.03', value: 88, pass: true },
  { label: '03.10', value: 93, pass: true },
  { label: '03.17', value: 100, pass: true },
  { label: '03.24', value: 95, pass: true },
];

const sentenceResults: ExamResult[] = [
  { label: '02.03', value: 74, pass: true },
  { label: '02.10', value: 58, pass: false },
  { label: '02.10', value: 80, pass: true }, // 재시험 합격
  { label: '02.24', value: 86, pass: true },
  { label: '03.03', value: 82, pass: true },
  { label: '03.17', value: 100, pass: true },
  { label: '03.24', value: 91, pass: true },
];

const reviewResults: DataPoint[] = [
  { label: '01.06', value: 68 },
  { label: '01.13', value: 72 },
  { label: '01.20', value: 70 },
  { label: '01.27', value: 75 },
  { label: '02.03', value: 72 },
  { label: '02.10', value: 78 },
  { label: '02.17', value: 82 },
  { label: '02.24', value: 84 },
  { label: '03.03', value: 80 },
  { label: '03.10', value: 87 },
  { label: '03.17', value: 95 },
  { label: '03.24', value: 89 },
  { label: '03.31', value: 96 },
];

const monthlyWords: DataPoint[] = [
  { label: '25.10', value: 120 },
  { label: '25.11', value: 180 },
  { label: '25.12', value: 150 },
  { label: '26.01', value: 200 },
  { label: '26.02', value: 150 },
  { label: '26.03', value: 150 },
];

type TabType = 'word' | 'sentence' | 'review' | 'monthly';

interface TabConfig {
  data: DataPoint[] | ExamResult[];
  yMin: number;
  yMax: number;
  yTicks: number[];
  passMode: boolean;
}

const tabConfigs: Record<TabType, TabConfig> = {
  word: {
    data: wordResults,
    yMin: 0,
    yMax: 100,
    yTicks: [20, 40, 60, 80, 100],
    passMode: true,
  },
  sentence: {
    data: sentenceResults,
    yMin: 0,
    yMax: 100,
    yTicks: [20, 40, 60, 80, 100],
    passMode: true,
  },
  review: {
    data: reviewResults,
    yMin: 0,
    yMax: 100,
    yTicks: [20, 40, 60, 80, 100],
    passMode: false,
  },
  monthly: {
    data: monthlyWords,
    yMin: 0,
    yMax: 300,
    yTicks: [0, 100, 200, 300],
    passMode: false,
  },
};

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

function ChartBody({
  config,
  containerWidth,
  height,
}: {
  config: TabConfig;
  containerWidth: number;
  height: number;
}) {
  const { data, yMin, yMax, yTicks, passMode } = config;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  // x축 기준: passMode는 고유 날짜, 그 외는 인덱스
  const uniqueLabels = passMode
    ? Array.from(new Set(data.map((d) => d.label)))
    : data.map((d) => d.label);
  const xCount = uniqueLabels.length;

  const innerW = Math.max(containerWidth - MARGIN.left - MARGIN.right, (xCount - 1) * POINT_GAP);
  const width = innerW + MARGIN.left + MARGIN.right;

  function getX(label: string): number {
    const idx = uniqueLabels.indexOf(label);
    return MARGIN.left + (xCount === 1 ? innerW / 2 : (idx / (xCount - 1)) * innerW);
  }

  function getY(v: number): number {
    return MARGIN.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  }

  const segments: React.ReactElement[] = [];
  const dots: React.ReactElement[] = [];
  const labels: React.ReactElement[] = [];

  if (passMode) {
    const examData = data as ExamResult[];
    let prevPass: { label: string; value: number } | null = null;

    examData.forEach((d, i) => {
      const cx = getX(d.label);
      const cy = getY(d.value);
      const color = d.pass ? PRIMARY : FAIL_COLOR;

      // pass → pass 구간만 선 연결
      if (d.pass && prevPass) {
        segments.push(
          <line
            key={`seg-${i}`}
            x1={getX(prevPass.label)}
            y1={getY(prevPass.value)}
            x2={cx}
            y2={cy}
            stroke={PRIMARY}
            strokeWidth={2.5}
            strokeLinecap="round"
          />,
        );
      }

      dots.push(
        <circle
          key={`dot-${i}`}
          cx={cx}
          cy={cy}
          r={4}
          fill={color}
          stroke="white"
          strokeWidth={2}
        />,
      );
      labels.push(
        <text
          key={`lbl-${i}`}
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          fill={color}
        >
          {d.value}
        </text>,
      );

      if (d.pass) prevPass = { label: d.label, value: d.value };
    });
  } else {
    data.forEach((d, i) => {
      const cx = getX(d.label);
      const cy = getY(d.value);

      if (i > 0) {
        segments.push(
          <line
            key={`seg-${i}`}
            x1={getX(data[i - 1].label)}
            y1={getY(data[i - 1].value)}
            x2={cx}
            y2={cy}
            stroke={PRIMARY}
            strokeWidth={2.5}
            strokeLinecap="round"
          />,
        );
      }

      dots.push(
        <circle
          key={`dot-${i}`}
          cx={cx}
          cy={cy}
          r={4}
          fill={PRIMARY}
          stroke="white"
          strokeWidth={2}
        />,
      );
      labels.push(
        <text
          key={`lbl-${i}`}
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          fill={AXIS_COLOR}
        >
          {d.value}
        </text>,
      );
    });
  }

  return (
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
      {uniqueLabels.map((lbl, i) => (
        <text
          key={`x-${i}`}
          x={getX(lbl)}
          y={MARGIN.top + innerH + 18}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={AXIS_COLOR}
        >
          {lbl}
        </text>
      ))}
      {segments}
      {dots}
      {labels}
    </svg>
  );
}

export function ScoreTrendChart() {
  const [activeTab, setActiveTab] = useState<TabType>('word');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
  }, [activeTab, size.width]);

  const config = tabConfigs[activeTab];
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
        {size.height > 0 && (
          <YAxis
            height={size.height}
            yMin={config.yMin}
            yMax={config.yMax}
            yTicks={config.yTicks}
          />
        )}
        <div ref={scrollRef} className="flex-1 overflow-x-auto">
          {chartWidth > 0 && (
            <ChartBody
              key={activeTab}
              config={config}
              containerWidth={chartWidth}
              height={size.height}
            />
          )}
        </div>
      </div>
    </section>
  );
}
