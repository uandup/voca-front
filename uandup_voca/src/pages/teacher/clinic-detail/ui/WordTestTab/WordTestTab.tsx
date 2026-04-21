import CycleRow, { type CycleRowData } from '@/features/word-test/ui/CycleRow';

const MOCK_CYCLES: CycleRowData[] = [
  {
    title: 'Cycle #48-97',
    badge: 'High Priority',
    scheduledDate: '23.10.23',
    steps: [
      {
        key: 'word',
        label: 'Word',
        status: 'active',
        date: '23.10.24',
        totalScore: '30',
        testType: 'Meaning to Word',
      },
      {
        key: 'sentence',
        label: 'Sentence',
        status: 'active',
        date: '23.10.24',
        totalScore: '30',
        testType: 'Meaning to Word',
      },
      {
        key: 'review1',
        label: 'Review 1',
        status: 'passed',
        date: '23.10.23',
        scores: ['98'],
        totalScore: '100',
        testType: 'Meaning to Word',
      },
      {
        key: 'review2',
        label: 'Review 2',
        status: 'fail',
        date: '23.10.24',
        scores: ['62'],
        totalScore: '100',
        testType: 'Meaning to Word',
      },
      {
        key: 'review3',
        label: 'Review 3',
        status: 'passed',
        date: '23.10.25',
        scores: ['55', '75', '88'],
        totalScore: '100',
        testType: 'Meaning to Word',
      },
    ],
  },
  {
    title: 'Cycle #01-47',
    badge: 'Standard',
    scheduledDate: '23.10.24',
    steps: [
      {
        key: 'word',
        label: 'Word Test',
        status: 'fail',
        date: '23.10.24',
        scores: ['62'],
        totalScore: '100',
        isPassed: false,
        testType: 'Meaning to Word',
      },
      {
        key: 'sentence',
        label: 'Sentence',
        status: 'locked',
        testType: 'Meaning to Word',
        subLabel: 'Locked',
      },
      {
        key: 'review1',
        label: 'Review 1',
        status: 'locked',
        testType: 'Meaning to Word',
        subLabel: 'Locked',
      },
      {
        key: 'review2',
        label: 'Review 2',
        status: 'locked',
        testType: 'Meaning to Word',
        subLabel: 'Locked',
      },
      {
        key: 'review3',
        label: 'Review 3',
        status: 'locked',
        testType: 'Meaning to Word',
        subLabel: 'Locked',
      },
    ],
  },
];

export default function WordTestTab() {
  return (
    <div className="flex flex-col gap-4">
      {MOCK_CYCLES.map((cycle) => (
        <CycleRow key={cycle.title} {...cycle} />
      ))}
    </div>
  );
}
