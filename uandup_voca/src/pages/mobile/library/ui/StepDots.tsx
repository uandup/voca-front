import type { StepCardVM } from '@/entities/test';
import { toStepMark, type MobileStepMark } from '../model/stepProgress';

// 긴 이름은 폰 폭에서 줄바꿈되므로 줄인다. 순서는 steps 배열과 1:1.
const SHORT_NAMES: Record<StepCardVM['name'], string> = {
  Word: 'Word',
  Sentence: 'Sen',
  'Review 1': 'R1',
  'Review 2': 'R2',
  'Review 3': 'R3',
};

/**
 * 5단계 진행 점 — 통과한 시험만 채우고, 스킵은 대시, 나머지는 빈 점.
 *
 * 상태를 3가지로 접는 근거는 model/stepProgress.ts의 toStepMark 주석 참고.
 */
export function StepDots({ steps }: { steps: StepCardVM[] }) {
  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const mark = toStepMark(step.status);
        return (
          <div key={step.name} className="flex items-start flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <Dot mark={mark} />
              <span
                className={`text-[10px] leading-none ${
                  mark === 'done'
                    ? 'font-bold text-on-surface-variant'
                    : 'font-semibold text-on-surface-variant/45'
                }`}
              >
                {SHORT_NAMES[step.name]}
              </span>
            </div>
            {/* 점 사이를 잇는 선. 마지막 점 뒤에는 그리지 않는다.
                앞 단계가 통과면 진하게 — 어디까지 왔는지가 선으로도 읽힌다. */}
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mt-[5px] min-w-2 ${
                  mark === 'done' ? 'bg-primary/35' : 'bg-outline-variant/40'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Dot({ mark }: { mark: MobileStepMark }) {
  if (mark === 'done') {
    return <span className="w-2.5 h-2.5 rounded-full bg-primary" aria-label="passed" />;
  }
  if (mark === 'skipped') {
    // 스킵은 "안 함"이 아니라 "건너뜀"이라 빈 점과 구분한다.
    return (
      <span className="w-2.5 h-2.5 flex items-center justify-center" aria-label="skipped">
        <span className="w-2 h-px bg-outline-variant" />
      </span>
    );
  }
  return (
    <span
      className="w-2.5 h-2.5 rounded-full border border-outline-variant"
      aria-label="not completed"
    />
  );
}
