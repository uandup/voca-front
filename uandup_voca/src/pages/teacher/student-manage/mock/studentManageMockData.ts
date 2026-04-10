export type TestType = 'W→EN' | 'W→KR' | 'M→W';

export interface ParentInfo {
  id: number;
  name: string;
  phone: string;
}

export const PARENT_MOCK: ParentInfo[] = [
  { id: 1, name: '김철수', phone: '010-1234-5678' },
  { id: 2, name: '이상훈', phone: '010-2345-6789' },
  { id: 3, name: '박영미', phone: '010-3456-7890' },
  { id: 4, name: '최영진', phone: '010-4567-8901' },
  { id: 5, name: '정미경', phone: '010-5678-9012' },
  { id: 6, name: '강호준', phone: '010-6789-0123' },
  { id: 7, name: '윤성호', phone: '010-7890-1234' },
  { id: 8, name: '한지영', phone: '010-8901-2345' },
  { id: 9, name: '이은수', phone: '010-1234-1234' },
  { id: 10, name: '고세규', phone: '010-1234-1234' },
];

export interface TestConfig {
  type: TestType;
  includeSynonyms: boolean;
}

export interface MemoItem {
  id: number;
  date: string; // "YYYY.MM.DD"
  content: string;
}

export interface RecentScore {
  score: number;
  total: number;
  date: string;
}

export interface ManagedStudent {
  id: number;
  nameFirstEn: string; // 이름 (예: Minsu)
  nameLastEn: string; // 성 (예: Kim)
  nameFirstKo: string; // 이름 (예: 민수)
  nameLastKo: string; // 성 (예: 김)
  grade: number;
  classes: string[];
  clinics: string[];
  accuracy: string;
  assignedLevel: number; // 1~10
  assignedWordCount: number;
  testQuestionCount: number;
  testConfig: TestConfig;
  recentScore?: RecentScore;
  memos: MemoItem[];
  parentName?: string;
  parentPhone?: string;
}

export const STUDENT_MANAGE_MOCK: ManagedStudent[] = [
  {
    id: 1,
    nameFirstEn: 'Minsu',
    nameLastEn: 'Kim',
    nameFirstKo: '민수',
    nameLastKo: '김',
    grade: 11,
    classes: ['G10 English', 'PreSAT Reading'],
    clinics: ['MON 13~15', 'THU 15~17'],
    accuracy: '87%',
    assignedLevel: 7,
    assignedWordCount: 50,
    testQuestionCount: 30,
    testConfig: { type: 'W→EN', includeSynonyms: true },
    recentScore: { score: 87, total: 100, date: '2026.04.01' },
    memos: [
      {
        id: 1,
        date: '2026.03.01',
        content: '단어 암기 속도가 매우 빠름. 고급 어휘 위주로 학습 중.',
      },
      {
        id: 2,
        date: '2026.04.01',
        content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.',
      },
      {
        id: 3,
        date: '2026.04.02',
        content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.',
      },
      {
        id: 4,
        date: '2026.04.03',
        content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.',
      },
      {
        id: 5,
        date: '2026.04.04',
        content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.',
      },
      {
        id: 6,
        date: '2026.04.05',
        content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트..가나다라마바.',
      },
    ],
    parentName: '김철수',
    parentPhone: '010-1234-5678',
  },
  {
    id: 2,
    nameFirstEn: 'Younghee',
    nameLastEn: 'Lee',
    nameFirstKo: '영희',
    nameLastKo: '이',
    grade: 9,
    classes: ['SAT'],
    clinics: ['TUE 13~15'],
    accuracy: '92%',
    assignedLevel: 3,
    assignedWordCount: 50,
    testQuestionCount: 30,
    testConfig: { type: 'W→KR', includeSynonyms: false },
    recentScore: { score: 92, total: 100, date: '2026.04.02' },
    memos: [
      {
        id: 1,
        date: '2026.03.15',
        content: '재시험 예정. 혼동 어휘 정리가 필요함.',
      },
    ],
    parentName: '이상훈',
    parentPhone: '010-2345-6789',
  },
  {
    id: 3,
    nameFirstEn: 'Jimin',
    nameLastEn: 'Park',
    nameFirstKo: '지민',
    nameLastKo: '박',
    grade: 12,
    classes: ['G10 English'],
    clinics: ['MON 13~15', 'WED 18~20'],
    accuracy: '78%',
    assignedLevel: 5,
    assignedWordCount: 40,
    testQuestionCount: 10,
    testConfig: { type: 'M→W', includeSynonyms: true },
    recentScore: { score: 78, total: 100, date: '2026.03.28' },
    memos: [
      {
        id: 1,
        date: '2026.02.20',
        content: '꾸준한 성적 향상 보임. 집중력이 좋음.',
      },
    ],
  },
  {
    id: 4,
    nameFirstEn: 'Suyeon',
    nameLastEn: 'Choi',
    nameFirstKo: '수연',
    nameLastKo: '최',
    grade: 10,
    classes: ['G9 English', 'Essay'],
    clinics: ['FRI 13~15'],
    accuracy: '95%',
    assignedLevel: 4,
    assignedWordCount: 80,
    testQuestionCount: 50,
    testConfig: { type: 'W→KR', includeSynonyms: true },
    recentScore: { score: 95, total: 100, date: '2026.04.03' },
    memos: [
      {
        id: 1,
        date: '2026.03.10',
        content: '학습 진도 빠름. 다음 단계 교재 준비 권장.',
      },
    ],
    parentName: '최영진',
    parentPhone: '010-3456-7890',
  },
  {
    id: 5,
    nameFirstEn: 'Dohyun',
    nameLastEn: 'Jung',
    nameFirstKo: '도현',
    nameLastKo: '정',
    grade: 11,
    classes: ['SAT', 'SL English'],
    clinics: ['TUE 13~15', 'SAT 10~12'],
    accuracy: '83%',
    assignedLevel: 8,
    assignedWordCount: 30,
    testQuestionCount: 10,
    testConfig: { type: 'W→EN', includeSynonyms: true },
    recentScore: { score: 83, total: 100, date: '2026.04.05' },
    memos: [],
  },
  {
    id: 6,
    nameFirstEn: 'Jisu',
    nameLastEn: 'Kang',
    nameFirstKo: '지수',
    nameLastKo: '강',
    grade: 10,
    classes: ['G9 English'],
    clinics: [],
    accuracy: '71%',
    assignedLevel: 2,
    assignedWordCount: 25,
    testQuestionCount: 10,
    testConfig: { type: 'W→KR', includeSynonyms: false },
    recentScore: { score: 71, total: 100, date: '2026.03.25' },
    memos: [{ id: 1, date: '2026.03.20', content: '기초 어휘 보완 중.' }],
  },
  {
    id: 7,
    nameFirstEn: 'Jaehyuk',
    nameLastEn: 'Yoon',
    nameFirstKo: '재혁',
    nameLastKo: '윤',
    grade: 12,
    classes: ['PreSAT Reading', 'SAT'],
    clinics: ['MON 13~15'],
    accuracy: '89%',
    assignedLevel: 7,
    assignedWordCount: 50,
    testQuestionCount: 30,
    testConfig: { type: 'W→EN', includeSynonyms: true },
    recentScore: { score: 89, total: 100, date: '2026.04.04' },
    memos: [{ id: 1, date: '2026.03.05', content: '심화 과정 진행 중.' }],
    parentName: '윤성호',
    parentPhone: '010-4567-8901',
  },
];
