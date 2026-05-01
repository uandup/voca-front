import type { ClinicData } from '../model/types';

export const CLINIC_MOCK: ClinicData = {
  sessions: [
    {
      id: 's1', timeSlot: '09:00 - 10:00', enrolled: 3,
      students: [
        { id: 1, nameLastKo: '김', nameFirstKo: '민수', nameLastEn: 'Kim', nameFirstEn: 'Minsu', role: 'student', status: 'approved', grade: 11, classes: [], clinics: [], assignedLevel: 7, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: 'word-to-meaning', includeSynonyms: true }, memos: [{ id: 1, date: '2026.04.08', content: '단어 암기 속도가 빠름.' }, { id: 2, date: '2026.04.01', content: '고급 어휘 위주 학습 권장.' }] },
        { id: 2, nameLastKo: '이', nameFirstKo: '영희', nameLastEn: 'Lee', nameFirstEn: 'Younghee', role: 'student', status: 'approved', grade: 9, classes: [], clinics: [], assignedLevel: 3, assignedWordCount: 30, testQuestionCount: 20, testConfig: { type: 'word-to-meaning', includeSynonyms: false }, memos: [{ id: 3, date: '2026.04.07', content: '재시험 예정.' }] },
        { id: 3, nameLastKo: '박', nameFirstKo: '지민', nameLastEn: 'Park', nameFirstEn: 'Jimin', role: 'student', status: 'approved', grade: 12, classes: [], clinics: [], assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: 'meaning-to-word', includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: 's2', timeSlot: '10:00 - 11:00', enrolled: 4,
      students: [
        { id: 4, nameLastKo: '최', nameFirstKo: '수연', nameLastEn: 'Choi', nameFirstEn: 'Suyeon', role: 'student', status: 'approved', grade: 10, classes: [], clinics: [], assignedLevel: 4, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: 'word-to-meaning', includeSynonyms: true }, memos: [] },
        { id: 5, nameLastKo: '정', nameFirstKo: '도현', nameLastEn: 'Jung', nameFirstEn: 'Dohyun', role: 'student', status: 'approved', grade: 11, classes: [], clinics: [], assignedLevel: 8, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: 'word-to-meaning', includeSynonyms: true }, memos: [{ id: 4, date: '2026.04.09', content: '집중력 좋음.' }] },
        { id: 6, nameLastKo: '강', nameFirstKo: '지수', nameLastEn: 'Kang', nameFirstEn: 'Jisu', role: 'student', status: 'approved', grade: 10, classes: [], clinics: [], assignedLevel: 2, assignedWordCount: 30, testQuestionCount: 20, testConfig: { type: 'word-to-meaning', includeSynonyms: false }, memos: [{ id: 5, date: '2026.04.05', content: '기초 어휘 보완 중.' }, { id: 6, date: '2026.03.28', content: '발음 교정 필요.' }] },
        { id: 7, nameLastKo: '오', nameFirstKo: '세훈', nameLastEn: 'Oh', nameFirstEn: 'Sehun', role: 'student', status: 'approved', grade: 9, classes: [], clinics: [], assignedLevel: 1, assignedWordCount: 20, testQuestionCount: 15, testConfig: { type: 'word-to-meaning', includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: 's3', timeSlot: '11:00 - 12:00', enrolled: 2,
      students: [
        { id: 8, nameLastKo: '한', nameFirstKo: '소희', nameLastEn: 'Han', nameFirstEn: 'Sohee', role: 'student', status: 'approved', grade: 11, classes: [], clinics: [], assignedLevel: 6, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: 'meaning-to-word', includeSynonyms: true }, memos: [] },
        { id: 9, nameLastKo: '송', nameFirstKo: '미래', nameLastEn: 'Song', nameFirstEn: 'Mirae', role: 'student', status: 'approved', grade: 10, classes: [], clinics: [], assignedLevel: 4, assignedWordCount: 40, testQuestionCount: 20, testConfig: { type: 'word-to-meaning', includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: 's4', timeSlot: '13:00 - 14:00', enrolled: 3,
      students: [
        { id: 10, nameLastKo: '임', nameFirstKo: '채원', nameLastEn: 'Lim', nameFirstEn: 'Chaewon', role: 'student', status: 'approved', grade: 10, classes: [], clinics: [], assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: 'word-to-meaning', includeSynonyms: false }, memos: [{ id: 7, date: '2026.04.08', content: '중간고사 대비 집중 학습 필요.' }] },
        { id: 11, nameLastKo: '윤', nameFirstKo: '재혁', nameLastEn: 'Yoon', nameFirstEn: 'Jaehyuk', role: 'student', status: 'approved', grade: 12, classes: [], clinics: [], assignedLevel: 9, assignedWordCount: 60, testQuestionCount: 35, testConfig: { type: 'word-to-meaning', includeSynonyms: true }, memos: [{ id: 8, date: '2026.04.06', content: '심화 과정 진행 중.' }] },
        { id: 12, nameLastKo: '박', nameFirstKo: '지민', nameLastEn: 'Park', nameFirstEn: 'Jimin', role: 'student', status: 'approved', grade: 12, classes: [], clinics: [], assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: 'meaning-to-word', includeSynonyms: false }, memos: [{ id: 14, date: '2026.04.04', content: '꾸준한 성적 향상.' }] },
      ],
    },
  ],
};
