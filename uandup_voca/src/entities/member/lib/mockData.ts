import type { Student, PendingStudent, PendingParent, PendingTeacher, StudentSummary, Teacher, Parent } from '../model/types';

export const STUDENT_MOCK: Student[] = [
  {
    id: 1,
    nameFirstEn: 'Minsu', nameLastEn: 'Kim', nameFirstKo: '민수', nameLastKo: '김',
    role: 'student', status: 'approved', grade: 11,
    classes: ['G10 English', 'PreSAT Reading'], clinics: ['MON 13~15', 'THU 15~17'],
    accuracy: '87%', assignedLevel: 7, assignedWordCount: 50, testQuestionCount: 30,
    testConfig: { type: 'word-to-meaning', includeSynonyms: true },
    recentScore: { score: 87, total: 100, date: '2026.04.01' },
    memos: [
      { id: 1, date: '2026.03.01', content: '단어 암기 속도가 매우 빠름. 고급 어휘 위주로 학습 중.' },
      { id: 2, date: '2026.04.01', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.' },
      { id: 3, date: '2026.04.02', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.' },
      { id: 4, date: '2026.04.03', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.' },
      { id: 5, date: '2026.04.04', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.' },
      { id: 6, date: '2026.04.05', content: '줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트..가나다라마바.' },
    ],
    parentName: '김철수', parentPhone: '010-1234-5678',
  },
  {
    id: 2,
    nameFirstEn: 'Younghee', nameLastEn: 'Lee', nameFirstKo: '영희', nameLastKo: '이',
    role: 'student', status: 'approved', grade: 9,
    classes: ['SAT'], clinics: ['TUE 13~15'],
    accuracy: '92%', assignedLevel: 3, assignedWordCount: 50, testQuestionCount: 30,
    testConfig: { type: 'word-to-meaning', includeSynonyms: false },
    recentScore: { score: 92, total: 100, date: '2026.04.02' },
    memos: [{ id: 1, date: '2026.03.15', content: '재시험 예정. 혼동 어휘 정리가 필요함.' }],
    parentName: '이상훈', parentPhone: '010-2345-6789',
  },
  {
    id: 3,
    nameFirstEn: 'Jimin', nameLastEn: 'Park', nameFirstKo: '지민', nameLastKo: '박',
    role: 'student', status: 'approved', grade: 12,
    classes: ['G10 English'], clinics: ['MON 13~15', 'WED 18~20'],
    accuracy: '78%', assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 10,
    testConfig: { type: 'meaning-to-word', includeSynonyms: true },
    recentScore: { score: 78, total: 100, date: '2026.03.28' },
    memos: [{ id: 1, date: '2026.02.20', content: '꾸준한 성적 향상 보임. 집중력이 좋음.' }],
  },
  {
    id: 4,
    nameFirstEn: 'Suyeon', nameLastEn: 'Choi', nameFirstKo: '수연', nameLastKo: '최',
    role: 'student', status: 'approved', grade: 10,
    classes: ['G9 English', 'Essay'], clinics: ['FRI 13~15'],
    accuracy: '95%', assignedLevel: 4, assignedWordCount: 80, testQuestionCount: 50,
    testConfig: { type: 'word-to-meaning', includeSynonyms: true },
    recentScore: { score: 95, total: 100, date: '2026.04.03' },
    memos: [{ id: 1, date: '2026.03.10', content: '학습 진도 빠름. 다음 단계 교재 준비 권장.' }],
    parentName: '최영진', parentPhone: '010-3456-7890',
  },
  {
    id: 5,
    nameFirstEn: 'Dohyun', nameLastEn: 'Jung', nameFirstKo: '도현', nameLastKo: '정',
    role: 'student', status: 'approved', grade: 11,
    classes: ['SAT', 'SL English'], clinics: ['TUE 13~15', 'SAT 10~12'],
    accuracy: '83%', assignedLevel: 8, assignedWordCount: 30, testQuestionCount: 10,
    testConfig: { type: 'word-to-meaning', includeSynonyms: true },
    recentScore: { score: 83, total: 100, date: '2026.04.05' },
    memos: [],
  },
  {
    id: 6,
    nameFirstEn: 'Jisu', nameLastEn: 'Kang', nameFirstKo: '지수', nameLastKo: '강',
    role: 'student', status: 'approved', grade: 10,
    classes: ['G9 English'], clinics: [],
    accuracy: '71%', assignedLevel: 2, assignedWordCount: 25, testQuestionCount: 10,
    testConfig: { type: 'word-to-meaning', includeSynonyms: false },
    recentScore: { score: 71, total: 100, date: '2026.03.25' },
    memos: [{ id: 1, date: '2026.03.20', content: '기초 어휘 보완 중.' }],
  },
  {
    id: 7,
    nameFirstEn: 'Jaehyuk', nameLastEn: 'Yoon', nameFirstKo: '재혁', nameLastKo: '윤',
    role: 'student', status: 'approved', grade: 12,
    classes: ['PreSAT Reading', 'SAT'], clinics: ['MON 13~15'],
    accuracy: '89%', assignedLevel: 7, assignedWordCount: 50, testQuestionCount: 30,
    testConfig: { type: 'word-to-meaning', includeSynonyms: true },
    recentScore: { score: 89, total: 100, date: '2026.04.04' },
    memos: [{ id: 1, date: '2026.03.05', content: '심화 과정 진행 중.' }],
    parentName: '윤성호', parentPhone: '010-4567-8901',
  },
];

export const PENDING_STUDENTS_MOCK: PendingStudent[] = [
  { id: 101, nameFirstKo: '지훈', nameLastKo: '김', nameFirstEn: 'Jihun', nameLastEn: 'Kim', role: 'student', status: 'pending', grade: 10, submittedAt: '2026.04.20' },
  { id: 102, nameFirstKo: '서연', nameLastKo: '박', nameFirstEn: 'Seoyeon', nameLastEn: 'Park', role: 'student', status: 'pending', grade: 9, submittedAt: '2026.04.21' },
  { id: 103, nameFirstKo: '준혁', nameLastKo: '이', nameFirstEn: 'Junhyuk', nameLastEn: 'Lee', role: 'student', status: 'pending', grade: 11, submittedAt: '2026.04.22' },
  { id: 104, nameFirstKo: '아영', nameLastKo: '최', nameFirstEn: 'Ayoung', nameLastEn: 'Choi', role: 'student', status: 'pending', grade: 12, submittedAt: '2026.04.23' },
  { id: 105, nameFirstKo: '도윤', nameLastKo: '한', nameFirstEn: 'Doyun', nameLastEn: 'Han', role: 'student', status: 'pending', grade: 10, submittedAt: '2026.04.24' },
];

export const PENDING_PARENTS_MOCK: PendingParent[] = [
  { id: 201, nameFirstKo: '영희', nameLastKo: '김', nameFirstEn: 'Younghee', nameLastEn: 'Kim', role: 'parent', status: 'pending', phone: '010-1111-2222', childNameKo: '김지훈', childGrade: 'Grade 10', matchedStudentId: null, submittedAt: '2026.04.20' },
  { id: 202, nameFirstKo: '철수', nameLastKo: '박', nameFirstEn: 'Chulsoo', nameLastEn: 'Park', role: 'parent', status: 'pending', phone: '010-3333-4444', childNameKo: '박서연', childGrade: 'Grade 9', matchedStudentId: null, submittedAt: '2026.04.21' },
  { id: 203, nameFirstKo: '미래', nameLastKo: '이', nameFirstEn: 'Mirae', nameLastEn: 'Lee', role: 'parent', status: 'pending', phone: '010-5555-6666', childNameKo: '이수민', childGrade: 'Grade 11', matchedStudentId: null, submittedAt: '2026.04.22' },
];

export const PENDING_TEACHERS_MOCK: PendingTeacher[] = [
  { id: 301, nameFirstKo: '지수', nameLastKo: '강', nameFirstEn: 'Jisu', nameLastEn: 'Kang', role: 'teacher', status: 'pending', submittedAt: '2026.04.18' },
  { id: 302, nameFirstKo: '대현', nameLastKo: '윤', nameFirstEn: 'Daehyun', nameLastEn: 'Yoon', role: 'teacher', status: 'pending', submittedAt: '2026.04.19' },
];

export const REGISTERED_STUDENTS_MOCK: StudentSummary[] = [
  { id: 1, nameFirstEn: 'Minsu', nameLastEn: 'Kim', grade: 11 },
  { id: 2, nameFirstEn: 'Younghee', nameLastEn: 'Lee', grade: 9 },
  { id: 3, nameFirstEn: 'Jimin', nameLastEn: 'Park', grade: 12 },
  { id: 4, nameFirstEn: 'Suyeon', nameLastEn: 'Choi', grade: 10 },
  { id: 5, nameFirstEn: 'Dohyun', nameLastEn: 'Jung', grade: 11 },
  { id: 6, nameFirstEn: 'Jisu', nameLastEn: 'Kang', grade: 10 },
  { id: 7, nameFirstEn: 'Jaehyuk', nameLastEn: 'Yoon', grade: 12 },
];

export const TEACHER_MOCK: Teacher[] = [
  { id: 1, nameFirstKo: '선생', nameLastKo: '김', nameFirstEn: 'Teacher', nameLastEn: 'Kim', role: 'teacher', status: 'approved', isAdmin: true },
  { id: 2, nameFirstKo: '선생', nameLastKo: '이', nameFirstEn: 'Teacher', nameLastEn: 'Lee', role: 'teacher', status: 'approved', isAdmin: false },
  { id: 3, nameFirstKo: '선생', nameLastKo: '박', nameFirstEn: 'Teacher', nameLastEn: 'Park', role: 'teacher', status: 'approved', isAdmin: false },
  { id: 4, nameFirstKo: '선생', nameLastKo: '최', nameFirstEn: 'Teacher', nameLastEn: 'Choi', role: 'teacher', status: 'approved', isAdmin: false },
  { id: 5, nameFirstKo: '선생', nameLastKo: '정', nameFirstEn: 'Teacher', nameLastEn: 'Jung', role: 'teacher', status: 'approved', isAdmin: false },
];

export const PARENT_MOCK: Parent[] = [
  { id: 1, nameFirstKo: '철수', nameLastKo: '김', nameFirstEn: 'Chulsoo', nameLastEn: 'Kim', role: 'parent', status: 'approved', phone: '010-1234-5678', matchedStudentId: 1 },
  { id: 2, nameFirstKo: '상훈', nameLastKo: '이', nameFirstEn: 'Sanghun', nameLastEn: 'Lee', role: 'parent', status: 'approved', phone: '010-2345-6789', matchedStudentId: 2 },
  { id: 3, nameFirstKo: '영미', nameLastKo: '박', nameFirstEn: 'Youngmi', nameLastEn: 'Park', role: 'parent', status: 'approved', phone: '010-3456-7890', matchedStudentId: 3 },
  { id: 4, nameFirstKo: '영진', nameLastKo: '최', nameFirstEn: 'Youngjin', nameLastEn: 'Choi', role: 'parent', status: 'approved', phone: '010-4567-8901', matchedStudentId: 4 },
  { id: 5, nameFirstKo: '미경', nameLastKo: '정', nameFirstEn: 'Mikyung', nameLastEn: 'Jung', role: 'parent', status: 'approved', phone: '010-5678-9012', matchedStudentId: 5 },
];
