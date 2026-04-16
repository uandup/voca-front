export type StepStatus = 'done' | 'fail' | 'active' | 'locked';

export interface TestStep {
  key: string;
  label: string;
  status: StepStatus;
  date?: string;
  score?: string;
  isPassed?: boolean;
  testType?: string; // e.g. "Word to Korean"
  subLabel?: string; // e.g. "Pending", "Unlocks in 4h"
  scheduledDate?: string;
}
