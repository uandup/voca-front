export type StepStatus = 'passed' | 'fail' | 'active' | 'pending' | 'locked';

export type TestType = 'Meaning to Word' | 'Word to Meaning';

export interface TestStep {
  key: string;
  label: string;
  status: StepStatus;
  date?: string;
  scores?: string[];
  totalScore?: string;
  failState?: 'fail' | 'awaiting';
  isPassed?: boolean;
  testType?: TestType;
  subLabel?: string;
  scheduledDate?: string;
}
