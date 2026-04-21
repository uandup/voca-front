import type { ESRow } from '@/features/test-offline';

// ────────────────────────────────────────────────
// 서버 응답 타입
// ────────────────────────────────────────────────
export interface VocabItem {
  word: string;
  korMeaning: string; // 한국어 뜻
  engMeaning: string; // 영어 뜻
  synonym: string; // 동의어
}

// ────────────────────────────────────────────────
// 서버 Mock Data (50개)
// ────────────────────────────────────────────────
export const mockVocabList: VocabItem[] = [
  {
    word: 'abandon',
    korMeaning: '포기하다',
    engMeaning: 'to cause someone to agree or do something through reasoning or encouragement.',
    synonym: 'forsake',
  },
  {
    word: 'abolish',
    korMeaning: '주점, 막대, 법원, 막다, 금하다',
    engMeaning:
      'a long piece of material or place serving drinks / to block someone from entering or doing something',
    synonym: 'eliminate',
  },
  {
    word: 'abundant',
    korMeaning: '풍부한',
    engMeaning: 'existing in large quantities',
    synonym: 'plentiful',
  },
  {
    word: 'accelerate',
    korMeaning: '가속하다',
    engMeaning: 'to increase in speed',
    synonym: 'hasten',
  },
  {
    word: 'accurate',
    korMeaning: '정확한',
    engMeaning: 'free from errors',
    synonym: 'precise',
  },
  {
    word: 'acknowledge',
    korMeaning: '인정하다',
    engMeaning: 'to accept or admit',
    synonym: 'recognize',
  },
  {
    word: 'acquire',
    korMeaning: '습득하다',
    engMeaning: 'to obtain something',
    synonym: 'obtain',
  },
  {
    word: 'adapt',
    korMeaning: '적응하다',
    engMeaning: 'to adjust to new conditions',
    synonym: 'adjust',
  },
  {
    word: 'adequate',
    korMeaning: '충분한',
    engMeaning: 'satisfactory or acceptable',
    synonym: 'sufficient',
  },
  {
    word: 'advocate',
    korMeaning: '지지하다',
    engMeaning: 'to publicly support',
    synonym: 'support',
  },
  {
    word: 'allocate',
    korMeaning: '할당하다',
    engMeaning: 'to distribute for a purpose',
    synonym: 'assign',
  },
  {
    word: 'alter',
    korMeaning: '변경하다',
    engMeaning: 'to change or modify',
    synonym: 'modify',
  },
  {
    word: 'ambiguous',
    korMeaning: '모호한',
    engMeaning: 'open to more than one meaning',
    synonym: 'vague',
  },
  {
    word: 'amplify',
    korMeaning: '증폭하다',
    engMeaning: 'to make larger or stronger',
    synonym: 'intensify',
  },
  {
    word: 'analyze',
    korMeaning: '분석하다',
    engMeaning: 'to examine in detail',
    synonym: 'examine',
  },
  {
    word: 'anticipate',
    korMeaning: '예상하다',
    engMeaning: 'to expect or predict',
    synonym: 'expect',
  },
  {
    word: 'apparent',
    korMeaning: '명백한',
    engMeaning: 'clearly visible or understood',
    synonym: 'obvious',
  },
  {
    word: 'appreciate',
    korMeaning: '감사하다',
    engMeaning: 'to recognize the value of',
    synonym: 'value',
  },
  {
    word: 'approach',
    korMeaning: '접근하다',
    engMeaning: 'to come near or deal with',
    synonym: 'method',
  },
  {
    word: 'appropriate',
    korMeaning: '적절한',
    engMeaning: 'suitable for a purpose',
    synonym: 'suitable',
  },
  {
    word: 'approximately',
    korMeaning: '대략',
    engMeaning: 'close to but not exact',
    synonym: 'roughly',
  },
  {
    word: 'arbitrary',
    korMeaning: '임의적인',
    engMeaning: 'based on random choice',
    synonym: 'random',
  },
  {
    word: 'assert',
    korMeaning: '주장하다',
    engMeaning: 'to state a fact confidently',
    synonym: 'claim',
  },
  {
    word: 'assess',
    korMeaning: '평가하다',
    engMeaning: 'to evaluate or estimate',
    synonym: 'evaluate',
  },
  {
    word: 'assume',
    korMeaning: '가정하다',
    engMeaning: 'to suppose without proof',
    synonym: 'presume',
  },
  {
    word: 'attain',
    korMeaning: '달성하다',
    engMeaning: 'to succeed in achieving',
    synonym: 'achieve',
  },
  {
    word: 'attribute',
    korMeaning: '~의 덕분으로 보다',
    engMeaning: 'to regard as caused by',
    synonym: 'ascribe',
  },
  {
    word: 'benefit',
    korMeaning: '이익',
    engMeaning: 'an advantage or profit',
    synonym: 'advantage',
  },
  {
    word: 'capable',
    korMeaning: '유능한',
    engMeaning: 'having the ability to do',
    synonym: 'competent',
  },
  {
    word: 'cease',
    korMeaning: '중단하다',
    engMeaning: 'to come or bring to an end',
    synonym: 'stop',
  },
  {
    word: 'challenge',
    korMeaning: '도전하다',
    engMeaning: 'to dispute or test',
    synonym: 'contest',
  },
  {
    word: 'clarify',
    korMeaning: '명확히 하다',
    engMeaning: 'to make something clearer',
    synonym: 'explain',
  },
  {
    word: 'collaborate',
    korMeaning: '협력하다',
    engMeaning: 'to work jointly with others',
    synonym: 'cooperate',
  },
  {
    word: 'compensate',
    korMeaning: '보상하다',
    engMeaning: 'to give something to make up for loss',
    synonym: 'reimburse',
  },
  {
    word: 'complex',
    korMeaning: '복잡한',
    engMeaning: 'consisting of many parts',
    synonym: 'complicated',
  },
  {
    word: 'comprehend',
    korMeaning: '이해하다',
    engMeaning: 'to understand fully',
    synonym: 'understand',
  },
  {
    word: 'concentrate',
    korMeaning: '집중하다',
    engMeaning: 'to focus attention on',
    synonym: 'focus',
  },
  {
    word: 'confirm',
    korMeaning: '확인하다',
    engMeaning: 'to establish the truth of',
    synonym: 'verify',
  },
  {
    word: 'consequence',
    korMeaning: '결과',
    engMeaning: 'a result of an action',
    synonym: 'outcome',
  },
  {
    word: 'contribute',
    korMeaning: '기여하다',
    engMeaning: 'to give in order to help',
    synonym: 'donate',
  },
  {
    word: 'controversy',
    korMeaning: '논란',
    engMeaning: 'prolonged public disagreement',
    synonym: 'dispute',
  },
  {
    word: 'convert',
    korMeaning: '전환하다',
    engMeaning: 'to change in form or character',
    synonym: 'transform',
  },
  {
    word: 'convince',
    korMeaning: '설득하다',
    engMeaning: 'to cause to believe something',
    synonym: 'persuade',
  },
  {
    word: 'cooperate',
    korMeaning: '협동하다',
    engMeaning: 'to work together toward a goal',
    synonym: 'collaborate',
  },
  {
    word: 'decline',
    korMeaning: '감소하다',
    engMeaning: 'to become smaller or weaker',
    synonym: 'decrease',
  },
  {
    word: 'define',
    korMeaning: '정의하다',
    engMeaning: 'to state the meaning of',
    synonym: 'specify',
  },
  {
    word: 'demonstrate',
    korMeaning: '증명하다',
    engMeaning: 'to show or prove clearly',
    synonym: 'prove',
  },
  {
    word: 'depict',
    korMeaning: '묘사하다',
    engMeaning: 'to represent in a picture',
    synonym: 'portray',
  },
  {
    word: 'derive',
    korMeaning: '유래하다',
    engMeaning: 'to obtain from a source',
    synonym: 'obtain',
  },
  {
    word: 'determine',
    korMeaning: '결정하다',
    engMeaning: 'to cause something to occur',
    synonym: 'decide',
  },
];

// ────────────────────────────────────────────────
// ES Mock Data (30개) — Example Sentence
// ___ 위치에 빈칸이 표시되며 학생이 단어를 채워 넣음
// ────────────────────────────────────────────────
export const mockESRows: ESRow[] = [
  {
    no: '1',
    sentence:
      'The event was a grand ___ that attracted many people because it was exciting, colorful, and impressive to watch.',
    answer: 'spectacle',
  },
  {
    no: '2',
    sentence: 'The government plans to ___ the outdated law next year.',
    answer: 'abolish',
  },
  {
    no: '3',
    sentence: 'The forest is ___ with wildlife during the spring season.',
    answer: 'teeming',
  },
  { no: '4', sentence: "Exercise can ___ the body's metabolism significantly.", answer: 'boost' },
  { no: '5', sentence: 'The report must be ___ in order to be accepted.', answer: 'accurate' },
  {
    no: '6',
    sentence: 'He failed to ___ his mistake in front of the class.',
    answer: 'acknowledge',
  },
  { no: '7', sentence: 'She worked hard to ___ new skills for the job.', answer: 'acquire' },
  {
    no: '8',
    sentence: 'You need to ___ your schedule to fit the new requirements.',
    answer: 'adjust',
  },
  {
    no: '9',
    sentence: 'The resources provided were barely ___ for the project.',
    answer: 'adequate',
  },
  {
    no: '10',
    sentence: 'He became a strong ___ for environmental protection.',
    answer: 'advocate',
  },
  {
    no: '11',
    sentence: 'The manager decided to ___ extra funds to the research team.',
    answer: 'allocate',
  },
  { no: '12', sentence: 'They had to ___ the plan due to unexpected changes.', answer: 'alter' },
  {
    no: '13',
    sentence: 'The instructions were ___ and caused a lot of confusion.',
    answer: 'ambiguous',
  },
  {
    no: '14',
    sentence: 'The new speaker system will ___ the sound throughout the hall.',
    answer: 'amplify',
  },
  {
    no: '15',
    sentence: 'Scientists ___ data to find patterns in climate change.',
    answer: 'analyze',
  },
  {
    no: '16',
    sentence: 'We should ___ potential problems before they occur.',
    answer: 'anticipate',
  },
  { no: '17', sentence: 'It was ___ that she was upset by the news.', answer: 'apparent' },
  { no: '18', sentence: 'I really ___ your help during the difficult time.', answer: 'appreciate' },
  { no: '19', sentence: 'We need a new ___ to solve this complex issue.', answer: 'approach' },
  {
    no: '20',
    sentence: 'It is not ___ to wear casual clothes to a formal event.',
    answer: 'appropriate',
  },
  {
    no: '21',
    sentence: 'The temperature was ___ 30 degrees Celsius that afternoon.',
    answer: 'approximately',
  },
  {
    no: '22',
    sentence: 'The decision seemed completely ___ and unfair to the staff.',
    answer: 'arbitrary',
  },
  {
    no: '23',
    sentence: 'She ___ her right to remain silent during questioning.',
    answer: 'asserted',
  },
  {
    no: '24',
    sentence: "The teacher will ___ each student's progress at the end of term.",
    answer: 'assess',
  },
  {
    no: '25',
    sentence: 'Never ___ that everyone agrees with your point of view.',
    answer: 'assume',
  },
  {
    no: '26',
    sentence: 'He worked tirelessly to ___ his dream of becoming a doctor.',
    answer: 'achieve',
  },
  {
    no: '27',
    sentence: 'She ___ her success to years of hard work and dedication.',
    answer: 'attributed',
  },
  {
    no: '28',
    sentence: 'Regular exercise provides a great ___ to your overall health.',
    answer: 'benefit',
  },
  {
    no: '29',
    sentence: 'The new model is ___ of processing data twice as fast.',
    answer: 'capable',
  },
  {
    no: '30',
    sentence: 'The noise from the construction finally ___ late at night.',
    answer: 'ceased',
  },
];
