import type { ESRow } from '@/widgets/test-offline';
import type { SentenceItem, TestSentenceAnswer } from '../model/types';

export const MOCK_SENTENCE_ITEMS: SentenceItem[] = [
  {
    id: 1,
    sentence:
      'The thief tried to ___ when the police arrived, hoping to escape with the stolen money before anyone could stop him.',
    answerWord: 'abscond',
  },
  {
    id: 2,
    sentence: 'She was ___ about the outcome, refusing to commit to either side.',
    answerWord: 'ambivalent',
  },
  {
    id: 3,
    sentence: 'His ___ remarks at the meeting made everyone uncomfortable.',
    answerWord: 'truculent',
  },
  {
    id: 4,
    sentence: 'The forest had a ___ beauty that left visitors in silence.',
    answerWord: 'ethereal',
  },
  {
    id: 5,
    sentence: 'Despite his wealth, he lived a ___ life, avoiding unnecessary expenses.',
    answerWord: 'frugal',
  },
  {
    id: 6,
    sentence: 'The politician gave a ___ speech, using few words to great effect.',
    answerWord: 'laconic',
  },
  {
    id: 7,
    sentence: 'Her ___ nature made it hard for others to keep up with her decisions.',
    answerWord: 'capricious',
  },
  {
    id: 8,
    sentence: "The company's ___ practices were eventually exposed by journalists.",
    answerWord: 'nefarious',
  },
  {
    id: 9,
    sentence: 'He remained ___ even when everyone around him was panicking.',
    answerWord: 'sanguine',
  },
  {
    id: 10,
    sentence: 'The new policy was seen as ___ to the interests of small businesses.',
    answerWord: 'inimical',
  },
];

export const MOCK_SENTENCE_ANSWERS: Record<number, TestSentenceAnswer> = Object.fromEntries(
  MOCK_SENTENCE_ITEMS.map((item) => [item.id, { word: item.answerWord ?? '' }]),
);

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

export const MOCK_ES_TEMPLATE: ESRow[] = Array.from({ length: 15 }, (_, i) => ({
  no: String(i + 1).padStart(2, '0'),
  sentence: '',
  answer: '',
}));
