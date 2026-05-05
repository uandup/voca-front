import type { TestBundle } from '../model/types';

export const MOCK_CYCLES: TestBundle[] = [
  {
    id: '1',
    assignedLevel: 7,
    wordCount: 50,
    steps: [
      { name: 'Word', status: 'pending', maxScore: 100 },
      { name: 'Sentence', status: 'active', maxScore: 100 },
      { name: 'Review 1', status: 'grading', maxScore: 100 },
      {
        name: 'Review 2',
        status: 'passed',
        scores: [98],
        maxScore: 100,
        gradedAt: '23.10.23',
      },
      {
        name: 'Review 3',
        status: 'fail',
        scores: [62],
        maxScore: 100,
        gradedAt: '23.10.24',
      },
    ],
  },
  {
    id: '2',
    assignedLevel: 3,
    wordCount: 47,
    steps: [
      { name: 'Word', status: 'fail', scores: [62], maxScore: 100 },
      { name: 'Sentence', status: 'locked' },
      { name: 'Review 1', status: 'locked' },
      { name: 'Review 2', status: 'locked' },
      { name: 'Review 3', status: 'locked' },
    ],
  },
  {
    id: '3',
    assignedLevel: 5,
    wordCount: 30,
    steps: [
      {
        name: 'Word',
        status: 'passed',
        scores: [95],
        maxScore: 100,
        gradedAt: '23.09.10',
      },
      {
        name: 'Sentence',
        status: 'passed',
        scores: [55, 88],
        maxScore: 100,
        gradedAt: '23.09.11',
      },
      {
        name: 'Review 1',
        status: 'passed',
        scores: [60, 72, 92],
        maxScore: 100,
        gradedAt: '23.09.12',
      },
      {
        name: 'Review 2',
        status: 'passed',
        scores: [96],
        maxScore: 100,
        createdAt: '23.09.13',
      },
      {
        name: 'Review 3',
        status: 'passed',
        scores: [100],
        maxScore: 100,
        createdAt: '23.09.14',
      },
    ],
  },
];

export const MOCK_CLINIC_CYCLES: TestBundle[] = [
  {
    id: 'c1',
    assignedLevel: 7,
    wordCount: 50,
    steps: [
      {
        name: 'Word',
        status: 'pending',
        createdAt: '23.10.24',
        maxScore: 30,
        testType: 'meaning-to-word',
      },
      {
        name: 'Sentence',
        status: 'active',
        createdAt: '23.10.24',
        maxScore: 30,
        testType: 'meaning-to-word',
      },
      {
        name: 'Review 1',
        status: 'passed',
        createdAt: '23.10.23',
        scores: [98],
        maxScore: 100,
        testType: 'meaning-to-word',
      },
      {
        name: 'Review 2',
        status: 'fail',
        createdAt: '23.10.24',
        scores: [62],
        maxScore: 100,
        testType: 'meaning-to-word',
      },
      {
        name: 'Review 3',
        status: 'passed',
        createdAt: '23.10.25',
        scores: [55, 75, 88],
        maxScore: 100,
        testType: 'meaning-to-word',
      },
    ],
  },
  {
    id: 'c2',
    assignedLevel: 3,
    wordCount: 47,
    steps: [
      {
        name: 'Word',
        status: 'fail',
        createdAt: '23.10.24',
        scores: [62],
        maxScore: 100,
        testType: 'meaning-to-word',
      },
      {
        name: 'Sentence',
        status: 'locked',
        testType: 'meaning-to-word',
      },
      {
        name: 'Review 1',
        status: 'locked',
        testType: 'meaning-to-word',
      },
      {
        name: 'Review 2',
        status: 'locked',
        testType: 'meaning-to-word',
      },
      {
        name: 'Review 3',
        status: 'locked',
        testType: 'meaning-to-word',
      },
    ],
  },
];
