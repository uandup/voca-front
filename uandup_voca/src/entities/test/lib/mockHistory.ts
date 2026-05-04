import type { WrongWordTestRecord, LevelTestRecord } from '../model/types';

export const MOCK_REVIEW_DECK_HISTORY: WrongWordTestRecord[] = [
  { date: '2026.05.10', quantity: 30, score: null, status: 'pending' },
  { date: '2026.05.05', quantity: 30, score: 27, status: 'pass' },
  { date: '2026.05.01', quantity: 30, score: 25, status: 'pass' },
  { date: '2026.04.28', quantity: 30, score: 12, status: 'fail' },
  { date: '2026.04.25', quantity: 30, score: 28, status: 'pass' },
];

export const MOCK_STUDENT_LEVEL_TEST_HISTORY: LevelTestRecord[] = [
  {
    date: '2026.05.10',
    level: 4,
    assignedQty: 200,
    testQty: 100,
    score: null,
    status: 'pending',
  },
  {
    date: '2026.05.05',
    level: 4,
    assignedQty: 200,
    testQty: 100,
    score: null,
    status: 'awaiting-test',
  },
  {
    date: '2026.05.01',
    level: 4,
    assignedQty: 200,
    testQty: 100,
    score: null,
    status: 'awaiting-grading',
  },
  { date: '2026.04.24', level: 4, assignedQty: 200, testQty: 50, score: 42, status: 'fail' },
  { date: '2026.04.12', level: 3, assignedQty: 200, testQty: 100, score: 98, status: 'pass' },
];
