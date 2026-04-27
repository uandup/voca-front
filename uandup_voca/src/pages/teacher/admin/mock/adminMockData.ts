export interface PendingStudent {
  id: number;
  nameKo: string;
  name: string;
  grade: number;
}

export interface PendingParent {
  id: number;
  nameKo: string;
  phone: string;
  childNameKo: string;
  childGrade: string;
  matchedStudentId: number | null;
}

export interface PendingTeacher {
  id: number;
  nameKo: string;
  name: string;
}

export const PENDING_STUDENTS: PendingStudent[] = [
  { id: 1, nameKo: '김지훈', name: 'Kim Jihun', grade: 10 },
  { id: 2, nameKo: '박서연', name: 'Park Seoyeon', grade: 9 },
  { id: 3, nameKo: '이준혁', name: 'Lee Junhyuk', grade: 11 },
  { id: 4, nameKo: '최아영', name: 'Choi Ayoung', grade: 12 },
  { id: 5, nameKo: '한도윤', name: 'Han Doyun', grade: 10 },
];

export const PENDING_PARENTS: PendingParent[] = [
  {
    id: 1,
    nameKo: '김영희',
    phone: '010-1111-2222',
    childNameKo: '김지훈',
    childGrade: 'Grade 10',
    matchedStudentId: null,
  },
  {
    id: 2,
    nameKo: '박철수',
    phone: '010-3333-4444',
    childNameKo: '박서연',
    childGrade: 'Grade 9',
    matchedStudentId: null,
  },
  {
    id: 3,
    nameKo: '이미래',
    phone: '010-5555-6666',
    childNameKo: '이수민',
    childGrade: 'Grade 11',
    matchedStudentId: null,
  },
];

export const PENDING_TEACHERS: PendingTeacher[] = [
  { id: 1, nameKo: '강지수', name: 'Kang Jisu' },
  { id: 2, nameKo: '윤대현', name: 'Yoon Daehyun' },
];

// 학부모 매칭용 등록된 학생 목록 (student-manage mock에서 가져온다고 가정)
export interface RegisteredStudent {
  id: number;
  nameKo: string;
  name: string;
  grade: number;
}

export const REGISTERED_STUDENTS: RegisteredStudent[] = [
  { id: 101, nameKo: '김민수', name: 'Kim Minsu', grade: 11 },
  { id: 102, nameKo: '이영희', name: 'Lee Younghee', grade: 9 },
  { id: 103, nameKo: '박지민', name: 'Park Jimin', grade: 12 },
  { id: 104, nameKo: '최수연', name: 'Choi Suyeon', grade: 10 },
  { id: 105, nameKo: '정도현', name: 'Jung Dohyun', grade: 11 },
  { id: 106, nameKo: '강지수', name: 'Kang Jisu', grade: 10 },
  { id: 107, nameKo: '윤재혁', name: 'Yoon Jaehyuk', grade: 12 },
  { id: 108, nameKo: '김지훈', name: 'Kim Jihun', grade: 10 },
  { id: 109, nameKo: '박서연', name: 'Park Seoyeon', grade: 9 },
];

export interface TeacherInfo {
  id: number;
  nameKo: string;
  name: string;
  isAdmin: boolean;
}

export const TEACHER_MOCK: TeacherInfo[] = [
  { id: 1, nameKo: '김선생', name: 'Kim Teacher', isAdmin: true },
  { id: 2, nameKo: '이선생', name: 'Lee Teacher', isAdmin: false },
  { id: 3, nameKo: '박선생', name: 'Park Teacher', isAdmin: false },
  { id: 4, nameKo: '최선생', name: 'Choi Teacher', isAdmin: false },
  { id: 5, nameKo: '정선생', name: 'Jung Teacher', isAdmin: false },
];

export interface ParentInfo {
  id: number;
  nameKo: string;
  phone: string;
  childNameKo: string;
  childGrade: string;
  matchedStudentId: number | null;
}

export const PARENT_MOCK: ParentInfo[] = [
  {
    id: 1,
    nameKo: '김영희',
    phone: '010-1111-2222',
    childNameKo: '김민수',
    childGrade: 'Grade 11',
    matchedStudentId: 101,
  },
  {
    id: 2,
    nameKo: '박철수',
    phone: '010-3333-4444',
    childNameKo: '이영희',
    childGrade: 'Grade 9',
    matchedStudentId: 102,
  },
  {
    id: 3,
    nameKo: '이미래',
    phone: '010-5555-6666',
    childNameKo: '박지민',
    childGrade: 'Grade 12',
    matchedStudentId: 103,
  },
  {
    id: 4,
    nameKo: '최하늘',
    phone: '010-7777-8888',
    childNameKo: '최수연',
    childGrade: 'Grade 10',
    matchedStudentId: 104,
  },
  {
    id: 5,
    nameKo: '정바다',
    phone: '010-9999-0000',
    childNameKo: '정도현',
    childGrade: 'Grade 11',
    matchedStudentId: 105,
  },
];
