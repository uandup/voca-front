import type { TestBundleRow } from '../model/types';

export const MOCK_CYCLES: TestBundleRow[] = [
  {
    id: '1',
    assignedLevel: 7,
    wordCount: 50,
    steps: [
      { name: 'Word', status: 'pending', gradedAt: null, lastScore: null, maxScore: 100, retakeCount: 0 },
      { name: 'Sentence', status: 'active', gradedAt: null, lastScore: null, maxScore: 100, retakeCount: 0 },
      { name: 'Review 1', status: 'grading', gradedAt: null, lastScore: null, maxScore: 100, retakeCount: 0 },
      { name: 'Review 2', status: 'passed', gradedAt: '23.10.23', lastScore: 98, maxScore: 100, retakeCount: 0 },
      { name: 'Review 3', status: 'fail', gradedAt: '23.10.24', lastScore: 62, maxScore: 100, retakeCount: 0 },
    ],
  },
  {
    id: '2',
    assignedLevel: 3,
    wordCount: 47,
    steps: [
      { name: 'Word', status: 'fail', gradedAt: null, lastScore: 62, maxScore: 100, retakeCount: 0 },
      { name: 'Sentence', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 },
      { name: 'Review 1', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 },
      { name: 'Review 2', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 },
      { name: 'Review 3', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 },
    ],
  },
  {
    id: '3',
    assignedLevel: 5,
    wordCount: 30,
    steps: [
      { name: 'Word', status: 'passed', gradedAt: '23.09.10', lastScore: 95, maxScore: 100, retakeCount: 0 },
      { name: 'Sentence', status: 'passed', gradedAt: '23.09.11', lastScore: 88, maxScore: 100, retakeCount: 1 },
      { name: 'Review 1', status: 'passed', gradedAt: '23.09.12', lastScore: 92, maxScore: 100, retakeCount: 2 },
      { name: 'Review 2', status: 'passed', gradedAt: '23.09.13', lastScore: 96, maxScore: 100, retakeCount: 0 },
      { name: 'Review 3', status: 'passed', gradedAt: '23.09.14', lastScore: 100, maxScore: 100, retakeCount: 0 },
    ],
  },
];

export const MOCK_CLINIC_CYCLES: TestBundleRow[] = [
  {
    id: 'c1',
    assignedLevel: 7,
    wordCount: 50,
    steps: [
      { name: 'Word', status: 'pending', gradedAt: '23.10.24', lastScore: null, maxScore: 30, retakeCount: 0 },
      { name: 'Sentence', status: 'active', gradedAt: '23.10.24', lastScore: null, maxScore: 30, retakeCount: 0 },
      { name: 'Review 1', status: 'passed', gradedAt: '23.10.23', lastScore: 98, maxScore: 100, retakeCount: 0 },
      { name: 'Review 2', status: 'fail', gradedAt: '23.10.24', lastScore: 62, maxScore: 100, retakeCount: 0 },
      { name: 'Review 3', status: 'passed', gradedAt: '23.10.25', lastScore: 88, maxScore: 100, retakeCount: 2 },
    ],
  },
  {
    id: 'c2',
    assignedLevel: 3,
    wordCount: 47,
    steps: [
      { name: 'Word', status: 'fail', gradedAt: '23.10.24', lastScore: 62, maxScore: 100, retakeCount: 0 },
      { name: 'Sentence', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 },
      { name: 'Review 1', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 },
      { name: 'Review 2', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 },
      { name: 'Review 3', status: 'locked', gradedAt: null, lastScore: null, maxScore: null, retakeCount: 0 },
    ],
  },
];
