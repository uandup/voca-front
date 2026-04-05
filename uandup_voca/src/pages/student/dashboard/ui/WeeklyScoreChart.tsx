import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Dot,
  Tooltip,
} from "recharts";
import type { TooltipProps } from "recharts";

const weekData = [
  { label: "02.03", score: 78, word: 80, sentence: 74, review: 72 },
  { label: "02.10", score: 82, word: 85, sentence: 80, review: 76 },
  { label: "02.17", score: 75, word: 70, sentence: 68, review: 82 },
  { label: "02.24", score: 88, word: 90, sentence: 86, review: 84 },
  { label: "03.03", score: 85, word: 88, sentence: 82, review: 80 },
  { label: "03.10", score: 91, word: 93, sentence: 90, review: 87 },
  { label: "03.17", score: 100, word: 100, sentence: 100, review: 100 },
  { label: "03.24", score: 93, word: 95, sentence: 91, review: 89 },
];

function addDays(mmdd: string, days: number): string {
  const [mm, dd] = mmdd.split(".").map(Number);
  const date = new Date(2026, mm - 1, dd + days);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}.${d}`;
}

interface WeekEntry {
  label: string;
  score: number;
  word: number;
  sentence: number;
  review: number;
}

function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string> & {
  payload?: { payload: WeekEntry }[];
}) {
  if (!active || !payload?.length) return null;
  const { label, score, word, sentence, review } = payload[0].payload;
  const endDate = addDays(label, 6);
  return (
    <div className="bg-white border border-outline-variant/20 rounded-xl shadow-lg px-4 py-3 text-xs min-w-35">
      <p className="font-bold text-on-surface-variant mb-2">
        {label} ~ {endDate}
      </p>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-4">
          <span className="text-on-surface-variant">Overall</span>
          <span className="font-black text-primary">{score}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-on-surface-variant">Word</span>
          <span className="font-bold text-on-surface">{word}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-on-surface-variant">Sentence</span>
          <span className="font-bold text-on-surface">{sentence}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-on-surface-variant">Review</span>
          <span className="font-bold text-on-surface">{review}%</span>
        </div>
      </div>
    </div>
  );
}

export function WeeklyScoreChart() {
  return (
    <section className="col-span-8 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-headline">Weekly Score Trend</h2>
        <span className="px-3 py-1 rounded-md bg-surface-container text-xs font-bold text-on-surface-variant">
          Last 8 Weeks
        </span>
      </div>
      <div className="h-84 w-full [&_*:focus]:outline-none [&_svg]:outline-none overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weekData}
            margin={{ top: 20, right: 16, left: -16, bottom: 0 }}
            style={{ outline: "none" }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis
              dataKey="label"
              tick={{
                fontSize: 11,
                fontWeight: 700,
                fill: "var(--color-on-surface-variant)",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 11, fill: "var(--color-on-surface-variant)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              isAnimationActive={false}
              cursor={{
                stroke: "var(--color-outline-variant)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Line
              type="linear"
              dataKey="score"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={
                <Dot
                  r={4}
                  fill="var(--color-primary)"
                  stroke="white"
                  strokeWidth={2}
                />
              }
              activeDot={{
                r: 6,
                fill: "var(--color-primary)",
                stroke: "white",
                strokeWidth: 2,
              }}
              label={{
                position: "top",
                fontSize: 10,
                fontWeight: 700,
                fill: "var(--color-on-surface-variant)",
                dy: -4,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
