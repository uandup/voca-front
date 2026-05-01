import type { WordTestItem } from '@/entities/word';
import type { ESRow } from '@/widgets/test-offline';
import type {
  SentenceItem,
  TestCycle,
  TestInfo,
  TestVocabAnswer,
  TestSentenceAnswer,
  WrongWordTestRecord,
  LevelTestRecord,
  ClinicCycle,
} from '../model/types';

export type VocabTestType = 'word-to-meaning' | 'meaning-to-word';
export type TestVocabItem = Required<Pick<WordTestItem, 'id'>> &
  Omit<WordTestItem, 'id'> & { synonymAnswer?: string };

export const ITEMS_PER_PAGE = 10;

export const MOCK_TEST_INFO: TestInfo = {
  title: 'The Scholarly Curator',
  subtitle: 'EXAMINATION II',
  description: 'Translate the target words and provide optional synonyms.',
  totalQuestions: 60,
  durationSeconds: 45 * 60,
};

export const MOCK_SENTENCE_ITEMS: SentenceItem[] = [
  { id: 1, sentence: 'The thief tried to ___ when the police arrived, hoping to escape with the stolen money before anyone could stop him.', answerWord: 'abscond' },
  { id: 2, sentence: 'She was ___ about the outcome, refusing to commit to either side.', answerWord: 'ambivalent' },
  { id: 3, sentence: 'His ___ remarks at the meeting made everyone uncomfortable.', answerWord: 'truculent' },
  { id: 4, sentence: 'The forest had a ___ beauty that left visitors in silence.', answerWord: 'ethereal' },
  { id: 5, sentence: 'Despite his wealth, he lived a ___ life, avoiding unnecessary expenses.', answerWord: 'frugal' },
  { id: 6, sentence: 'The politician gave a ___ speech, using few words to great effect.', answerWord: 'laconic' },
  { id: 7, sentence: 'Her ___ nature made it hard for others to keep up with her decisions.', answerWord: 'capricious' },
  { id: 8, sentence: "The company's ___ practices were eventually exposed by journalists.", answerWord: 'nefarious' },
  { id: 9, sentence: 'He remained ___ even when everyone around him was panicking.', answerWord: 'sanguine' },
  { id: 10, sentence: 'The new policy was seen as ___ to the interests of small businesses.', answerWord: 'inimical' },
];

export const MOCK_VOCAB_ITEMS: TestVocabItem[] = [
  { id: 1, word: 'Ubiquitous', korMeaning: '어디에나 있는', engMeaning: 'present everywhere', synonymAnswer: 'omnipresent, omnipresent, omnipresent' },
  { id: 2, word: 'Ephemeral', korMeaning: '수명이 짧은', engMeaning: 'lasting for a short time', synonymAnswer: 'transient' },
  { id: 3, word: 'persuade', korMeaning: '설득하다, 납득시키다', engMeaning: 'to cause someone to agree or do something through reasoning or encouragement. to cause someone to agree or do something through reasoning or encouragement.', synonymAnswer: 'convince' },
  { id: 4, word: 'Lugubrious', korMeaning: '침울한', engMeaning: 'looking or sounding sad and dismal', synonymAnswer: 'mournful' },
  { id: 5, word: 'Reticent', korMeaning: '과묵한', engMeaning: 'not revealing thoughts or feelings readily', synonymAnswer: 'reserved' },
  { id: 6, word: 'Loquacious', korMeaning: '수다스러운', engMeaning: 'tending to talk a great deal', synonymAnswer: 'talkative' },
  { id: 7, word: 'Pernicious', korMeaning: '해로운', engMeaning: 'having a harmful effect', synonymAnswer: 'detrimental' },
  { id: 8, word: 'Sanguine', korMeaning: '낙관적인', engMeaning: 'optimistic, especially in a difficult situation', synonymAnswer: 'optimistic' },
  { id: 9, word: 'Assiduous', korMeaning: '근면한', engMeaning: 'showing great care and perseverance', synonymAnswer: 'diligent' },
  { id: 10, word: 'Fastidious', korMeaning: '까다로운', engMeaning: 'very attentive to detail', synonymAnswer: 'meticulous' },
  { id: 11, word: 'Obfuscate', korMeaning: '모호하게 하다', engMeaning: 'to make unclear or confusing', synonymAnswer: 'obscure' },
  { id: 12, word: 'Capricious', korMeaning: '변덕스러운', engMeaning: 'given to sudden changes of mood', synonymAnswer: 'fickle' },
  { id: 13, word: 'Esoteric', korMeaning: '난해한', engMeaning: 'intended for a small, specialized group', synonymAnswer: 'arcane' },
  { id: 14, word: 'Pedantic', korMeaning: '현학적인', engMeaning: 'overly concerned with minor details', synonymAnswer: 'nitpicky' },
  { id: 15, word: 'Ostentatious', korMeaning: '과시적인', engMeaning: 'characterized by vulgar display', synonymAnswer: 'showy' },
  { id: 16, word: 'Pragmatic', korMeaning: '실용적인', engMeaning: 'dealing with things sensibly and realistically', synonymAnswer: 'practical' },
  { id: 17, word: 'Iconoclast', korMeaning: '인습 타파주의자', engMeaning: 'a person who attacks cherished beliefs', synonymAnswer: 'rebel' },
  { id: 18, word: 'Cacophony', korMeaning: '불협화음', engMeaning: 'a harsh, discordant mixture of sounds', synonymAnswer: 'discord' },
  { id: 19, word: 'Enervate', korMeaning: '기력을 빼앗다', engMeaning: 'to weaken physically or mentally', synonymAnswer: 'debilitate' },
  { id: 20, word: 'Alacrity', korMeaning: '민첩함', engMeaning: 'brisk and cheerful readiness', synonymAnswer: 'eagerness' },
  { id: 21, word: 'Perfidious', korMeaning: '불성실한', engMeaning: 'deceitful and untrustworthy', synonymAnswer: 'treacherous' },
  { id: 22, word: 'Mellifluous', korMeaning: '감미로운', engMeaning: 'sweet or musical; pleasant to hear', synonymAnswer: 'honeyed' },
  { id: 23, word: 'Vociferous', korMeaning: '소리 높여 외치는', engMeaning: 'expressing opinions loudly and forcefully', synonymAnswer: 'clamorous' },
  { id: 24, word: 'Perspicacious', korMeaning: '통찰력 있는', engMeaning: 'having a ready insight; shrewd', synonymAnswer: 'shrewd' },
  { id: 25, word: 'Recalcitrant', korMeaning: '반항적인', engMeaning: 'having an obstinately uncooperative attitude', synonymAnswer: 'defiant' },
  { id: 26, word: 'Truculent', korMeaning: '호전적인', engMeaning: 'eager or quick to argue or fight', synonymAnswer: 'aggressive' },
  { id: 27, word: 'Magnanimous', korMeaning: '관대한', engMeaning: 'generous or forgiving, especially to rivals', synonymAnswer: 'generous' },
  { id: 28, word: 'Quixotic', korMeaning: '비현실적인', engMeaning: 'exceedingly idealistic; unrealistic', synonymAnswer: 'idealistic' },
  { id: 29, word: 'Tenacious', korMeaning: '끈질긴', engMeaning: 'tending to keep a firm hold; persistent', synonymAnswer: 'persistent' },
  { id: 30, word: 'Nefarious', korMeaning: '극악한', engMeaning: 'wicked or criminal', synonymAnswer: 'wicked' },
  { id: 31, word: 'Inimical', korMeaning: '적대적인', engMeaning: 'tending to obstruct or harm; hostile', synonymAnswer: 'hostile' },
  { id: 32, word: 'Querulous', korMeaning: '불평이 많은', engMeaning: 'complaining in a petulant way', synonymAnswer: 'complaining' },
  { id: 33, word: 'Pugnacious', korMeaning: '싸움을 좋아하는', engMeaning: 'eager or quick to argue or fight', synonymAnswer: 'belligerent' },
  { id: 34, word: 'Volatile', korMeaning: '변동이 심한', engMeaning: 'liable to change rapidly and unpredictably', synonymAnswer: 'unstable' },
  { id: 35, word: 'Mendacious', korMeaning: '거짓말하는', engMeaning: 'not telling the truth; lying', synonymAnswer: 'dishonest' },
  { id: 36, word: 'Inveterate', korMeaning: '뿌리 깊은', engMeaning: 'having a habit too firmly established to change', synonymAnswer: 'habitual' },
  { id: 37, word: 'Trepidation', korMeaning: '두려움', engMeaning: 'a feeling of fear or anxiety', synonymAnswer: 'anxiety' },
  { id: 38, word: 'Obsequious', korMeaning: '아부하는', engMeaning: 'obedient or attentive to an excessive degree', synonymAnswer: 'sycophantic' },
  { id: 39, word: 'Circumspect', korMeaning: '신중한', engMeaning: 'wary and unwilling to take risks', synonymAnswer: 'cautious' },
  { id: 40, word: 'Discordant', korMeaning: '불화하는', engMeaning: 'disagreeing or incongruous', synonymAnswer: 'conflicting' },
  { id: 41, word: 'Insolent', korMeaning: '무례한', engMeaning: 'showing a rude lack of respect', synonymAnswer: 'impudent' },
  { id: 42, word: 'Vivacious', korMeaning: '활기찬', engMeaning: 'attractively lively and animated', synonymAnswer: 'lively' },
  { id: 43, word: 'Desolate', korMeaning: '황량한', engMeaning: 'feeling or showing misery or loneliness', synonymAnswer: 'barren' },
  { id: 44, word: 'Ambivalent', korMeaning: '양가감정의', engMeaning: 'having mixed feelings about something', synonymAnswer: 'conflicted' },
  { id: 45, word: 'Belligerent', korMeaning: '호전적인', engMeaning: 'hostile and aggressive', synonymAnswer: 'aggressive' },
  { id: 46, word: 'Candid', korMeaning: '솔직한', engMeaning: 'truthful and straightforward', synonymAnswer: 'frank' },
  { id: 47, word: 'Dogmatic', korMeaning: '독단적인', engMeaning: 'inclined to lay down principles as undeniably true', synonymAnswer: 'doctrinaire' },
  { id: 48, word: 'Enigmatic', korMeaning: '수수께끼 같은', engMeaning: 'difficult to interpret or understand', synonymAnswer: 'mysterious' },
  { id: 49, word: 'Garrulous', korMeaning: '수다스러운', engMeaning: 'excessively talkative, especially on trivial matters', synonymAnswer: 'chatty' },
  { id: 50, word: 'Laconic', korMeaning: '간결한', engMeaning: 'using very few words', synonymAnswer: 'brief' },
];

export const MOCK_ANSWERS_WTM: Record<number, TestVocabAnswer> = Object.fromEntries(
  MOCK_VOCAB_ITEMS.map((item) => [item.id, { meaning: item.korMeaning, synonym: item.synonymAnswer ?? '' }]),
);

export const MOCK_ANSWERS_MTW: Record<number, TestVocabAnswer> = Object.fromEntries(
  MOCK_VOCAB_ITEMS.map((item) => [item.id, { meaning: item.word, synonym: item.synonymAnswer ?? '' }]),
);

export const MOCK_SENTENCE_ANSWERS: Record<number, TestSentenceAnswer> = Object.fromEntries(
  MOCK_SENTENCE_ITEMS.map((item) => [item.id, { word: item.answerWord ?? '' }]),
);

export const MOCK_VOCAB_LIST: WordTestItem[] = [
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
export const MOCK_ES_ROWS: ESRow[] = [
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

export const MOCK_CYCLES: TestCycle[] = [
  {
    id: '1',
    assignedLevel: 7,
    wordCount: 50,
    steps: [
      { key: 'word', label: 'Word', status: 'waiting', totalScore: '100' },
      { key: 'sentence', label: 'Sentence', status: 'available', totalScore: '100' },
      { key: 'review1', label: 'Review 1', status: 'grading', totalScore: '100' },
      { key: 'review2', label: 'Review 2', status: 'passed', scores: ['98'], totalScore: '100', gradedDate: '23.10.23' },
      { key: 'review3', label: 'Review 3', status: 'fail', scores: ['62'], totalScore: '100', gradedDate: '23.10.24' },
    ],
  },
  {
    id: '2',
    assignedLevel: 3,
    wordCount: 47,
    steps: [
      { key: 'word', label: 'Word', status: 'fail', scores: ['62'], totalScore: '100' },
      { key: 'sentence', label: 'Sentence', status: 'locked' },
      { key: 'review1', label: 'Review 1', status: 'locked' },
      { key: 'review2', label: 'Review 2', status: 'locked' },
      { key: 'review3', label: 'Review 3', status: 'locked' },
    ],
  },
  {
    id: '3',
    assignedLevel: 5,
    wordCount: 30,
    steps: [
      { key: 'word', label: 'Word', status: 'passed', scores: ['95'], totalScore: '100', gradedDate: '23.09.10' },
      { key: 'sentence', label: 'Sentence', status: 'passed', scores: ['55', '88'], totalScore: '100', gradedDate: '23.09.11' },
      { key: 'review1', label: 'Review 1', status: 'passed', scores: ['60', '72', '92'], totalScore: '100', gradedDate: '23.09.12' },
      { key: 'review2', label: 'Review 2', status: 'passed', scores: ['96'], totalScore: '100', gradedDate: '23.09.13' },
      { key: 'review3', label: 'Review 3', status: 'passed', scores: ['100'], totalScore: '100', gradedDate: '23.09.14' },
    ],
  },
];

// 학생 - Review Deck 테스트 이력 (WrongWordBankPage)
export const MOCK_REVIEW_DECK_HISTORY: WrongWordTestRecord[] = [
  { date: '2026.05.10', quantity: 30, score: null, status: 'awaiting-test' },
  { date: '2026.05.05', quantity: 30, score: 27, status: 'completed' },
  { date: '2026.05.01', quantity: 30, score: 25, status: 'completed' },
  { date: '2026.04.28', quantity: 30, score: 12, status: 'fail' },
  { date: '2026.04.25', quantity: 30, score: 28, status: 'completed' },
];

// 학생 - Level Test 이력 (LevelTestPage)
export const MOCK_STUDENT_LEVEL_TEST_HISTORY: LevelTestRecord[] = [
  { date: '2026.05.10', level: 4, quantity: 100, score: null, status: 'pending' },
  { date: '2026.05.05', level: 4, quantity: 100, score: null, status: 'awaiting-test' },
  { date: '2026.05.01', level: 4, quantity: 100, score: null, status: 'awaiting-grading' },
  { date: '2026.04.24', level: 4, quantity: 50, score: 42, status: 'fail' },
  { date: '2026.04.12', level: 3, quantity: 100, score: 98, status: 'completed' },
];


// 클리닉 - Word Test 사이클 목록 (WordTestTab)
export const MOCK_CLINIC_CYCLES: ClinicCycle[] = [
  {
    title: 'Cycle #48-97',
    badge: 'High Priority',
    scheduledDate: '23.10.23',
    steps: [
      { key: 'word', label: 'Word', status: 'pending', date: '23.10.24', totalScore: '30', testType: 'meaning-to-word' },
      { key: 'sentence', label: 'Sentence', status: 'active', date: '23.10.24', totalScore: '30', testType: 'meaning-to-word' },
      { key: 'review1', label: 'Review 1', status: 'passed', date: '23.10.23', scores: ['98'], totalScore: '100', testType: 'meaning-to-word' },
      { key: 'review2', label: 'Review 2', status: 'fail', date: '23.10.24', scores: ['62'], totalScore: '100', testType: 'meaning-to-word' },
      { key: 'review3', label: 'Review 3', status: 'passed', date: '23.10.25', scores: ['55', '75', '88'], totalScore: '100', testType: 'meaning-to-word' },
    ],
  },
  {
    title: 'Cycle #01-47',
    badge: 'Standard',
    scheduledDate: '23.10.24',
    steps: [
      { key: 'word', label: 'Word Test', status: 'fail', date: '23.10.24', scores: ['62'], totalScore: '100', isPassed: false, testType: 'meaning-to-word' },
      { key: 'sentence', label: 'Sentence', status: 'locked', testType: 'meaning-to-word', subLabel: 'Locked' },
      { key: 'review1', label: 'Review 1', status: 'locked', testType: 'meaning-to-word', subLabel: 'Locked' },
      { key: 'review2', label: 'Review 2', status: 'locked', testType: 'meaning-to-word', subLabel: 'Locked' },
      { key: 'review3', label: 'Review 3', status: 'locked', testType: 'meaning-to-word', subLabel: 'Locked' },
    ],
  },
];

// Print Preview - 빈 예문 시험지 템플릿 (PrintPreviewPage)
export const MOCK_ES_TEMPLATE: ESRow[] = Array.from({ length: 15 }, (_, i) => ({
  no: String(i + 1).padStart(2, '0'),
  sentence: '',
  answer: '',
}));
