import type { StudentManageTableRow } from '../model/types';

type UnassignedStudentListItem = {
  id: number;
  nameKo: string;
  nameFirstEn: string;
  nameLastEn: string;
  grade: number;
  clinics: string[];
};
type RegisteredStudentRow = {
  id: number;
  nameKo: string;
  nameFirstEn: string;
  nameLastEn: string;
  grade: number;
};

export const STUDENT_MOCK: StudentManageTableRow[] = [
  {
    id: 1,
    nameKo: '김민수',
    nameFirstEn: 'Minsu',
    nameLastEn: 'Kim',
    grade: 11,
    classes: ['G10 English', 'PreSAT Reading'],
    accuracy: '87%',
    assignedLevel: 7,
    assignedWordCount: 50,
    testQuestionCount: 30,
    testConfig: { type: 'word-to-meaning', includeSynonyms: true },
    recentScore: { score: 87, total: 100 },
    memos: [
      {
        id: 1,
        date: '2026.03.01',
        content: '단어 암기 속도가 매우 빠름. 고급 어휘 위주로 학습 중.',
      },
      { id: 2, date: '2026.04.01', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.' },
      { id: 3, date: '2026.04.02', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.' },
      { id: 4, date: '2026.04.03', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.' },
      { id: 5, date: '2026.04.04', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.' },
      {
        id: 6,
        date: '2026.04.05',
        content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트..가나다라마바.',
      },
    ],
    latestMemoContent: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트..가나다라마바.',
  },
  {
    id: 2,
    nameKo: '이영희',
    nameFirstEn: 'Younghee',
    nameLastEn: 'Lee',
    grade: 9,
    classes: ['SAT'],
    accuracy: '92%',
    assignedLevel: 3,
    assignedWordCount: 50,
    testQuestionCount: 30,
    testConfig: { type: 'word-to-meaning', includeSynonyms: false },
    recentScore: { score: 92, total: 100 },
    memos: [{ id: 1, date: '2026.03.15', content: '재시험 예정. 혼동 어휘 정리가 필요함.' }],
    latestMemoContent: '재시험 예정. 혼동 어휘 정리가 필요함.',
  },
  {
    id: 3,
    nameKo: '박지민',
    nameFirstEn: 'Jimin',
    nameLastEn: 'Park',
    grade: 12,
    classes: ['G10 English'],
    accuracy: '78%',
    assignedLevel: 5,
    assignedWordCount: 40,
    testQuestionCount: 10,
    testConfig: { type: 'meaning-to-word', includeSynonyms: true },
    recentScore: { score: 78, total: 100 },
    memos: [{ id: 1, date: '2026.02.20', content: '꾸준한 성적 향상 보임. 집중력이 좋음.' }],
    latestMemoContent: '꾸준한 성적 향상 보임. 집중력이 좋음.',
  },
  {
    id: 4,
    nameKo: '최수연',
    nameFirstEn: 'Suyeon',
    nameLastEn: 'Choi',
    grade: 10,
    classes: ['G9 English', 'Essay'],
    accuracy: '95%',
    assignedLevel: 4,
    assignedWordCount: 80,
    testQuestionCount: 50,
    testConfig: { type: 'word-to-meaning', includeSynonyms: true },
    recentScore: { score: 95, total: 100 },
    memos: [{ id: 1, date: '2026.03.10', content: '학습 진도 빠름. 다음 단계 교재 준비 권장.' }],
    latestMemoContent: '학습 진도 빠름. 다음 단계 교재 준비 권장.',
  },
  {
    id: 5,
    nameKo: '정도현',
    nameFirstEn: 'Dohyun',
    nameLastEn: 'Jung',
    grade: 11,
    classes: ['SAT', 'SL English'],
    accuracy: '83%',
    assignedLevel: 8,
    assignedWordCount: 30,
    testQuestionCount: 10,
    testConfig: { type: 'word-to-meaning', includeSynonyms: true },
    recentScore: { score: 83, total: 100 },
    memos: [],
    latestMemoContent: null,
  },
  {
    id: 6,
    nameKo: '강지수',
    nameFirstEn: 'Jisu',
    nameLastEn: 'Kang',
    grade: 10,
    classes: ['G9 English'],
    accuracy: '71%',
    assignedLevel: 2,
    assignedWordCount: 25,
    testQuestionCount: 10,
    testConfig: { type: 'word-to-meaning', includeSynonyms: false },
    recentScore: { score: 71, total: 100 },
    memos: [{ id: 1, date: '2026.03.20', content: '기초 어휘 보완 중.' }],
    latestMemoContent: '기초 어휘 보완 중.',
  },
  {
    id: 7,
    nameKo: '윤재혁',
    nameFirstEn: 'Jaehyuk',
    nameLastEn: 'Yoon',
    grade: 12,
    classes: ['PreSAT Reading', 'SAT'],
    accuracy: '89%',
    assignedLevel: 7,
    assignedWordCount: 50,
    testQuestionCount: 30,
    testConfig: { type: 'word-to-meaning', includeSynonyms: true },
    recentScore: { score: 89, total: 100 },
    memos: [{ id: 1, date: '2026.03.05', content: '심화 과정 진행 중.' }],
    latestMemoContent: '심화 과정 진행 중.',
  },
];

export const MOCK_UNASSIGNED_STUDENTS: UnassignedStudentListItem[] = [
  {
    id: 1,
    nameKo: '강지수',
    nameFirstEn: 'Jisu',
    nameLastEn: 'Kang',
    grade: 10,
    clinics: ['MON 13:00~15:00', 'WED 18:00~20:00'],
  },
  {
    id: 2,
    nameKo: '오민준',
    nameFirstEn: 'Minjun',
    nameLastEn: 'Oh',
    grade: 9,
    clinics: ['TUE 13:00~15:00'],
  },
  { id: 3, nameKo: '신예린', nameFirstEn: 'Yerin', nameLastEn: 'Shin', grade: 11, clinics: [] },
  {
    id: 4,
    nameKo: '한도윤',
    nameFirstEn: 'Doyun',
    nameLastEn: 'Han',
    grade: 10,
    clinics: ['MON 13:00~15:00', 'THU 15:00~17:00', 'SAT 10:00~12:00'],
  },
  {
    id: 5,
    nameKo: '이준혁',
    nameFirstEn: 'Junhyuk',
    nameLastEn: 'Lee',
    grade: 12,
    clinics: ['FRI 15:00~17:00'],
  },
];

export const MOCK_PENDING_APPROVALS: RegisteredStudentRow[] = [
  { id: 1, nameKo: '김지훈', nameFirstEn: 'Jihun', nameLastEn: 'Kim', grade: 10 },
  { id: 2, nameKo: '박서연', nameFirstEn: 'Seoyeon', nameLastEn: 'Park', grade: 9 },
  { id: 3, nameKo: '이준혁', nameFirstEn: 'Junhyuk', nameLastEn: 'Lee', grade: 11 },
  { id: 4, nameKo: '최아영', nameFirstEn: 'Ayoung', nameLastEn: 'Choi', grade: 12 },
  { id: 5, nameKo: '한도윤', nameFirstEn: 'Doyun', nameLastEn: 'Han', grade: 10 },
  { id: 6, nameKo: '오민준', nameFirstEn: 'Minjun', nameLastEn: 'Oh', grade: 9 },
  { id: 7, nameKo: '신예린', nameFirstEn: 'Yerin', nameLastEn: 'Shin', grade: 11 },
];
