export type VocabTestType = 'word-to-meaning' | 'meaning-to-word';
export type TestType = VocabTestType | 'sentence';

export interface TestSentenceItem {
  id: number;
  sentence: string; // ___ 위치에 빈칸
  answerWord?: string;
}

export const MOCK_SENTENCE_ITEMS: TestSentenceItem[] = [
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

export interface TestVocabItem {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
  synonymAnswer?: string;
}

export interface TestInfo {
  title: string;
  subtitle: string;
  description: string;
  totalQuestions: number;
  durationSeconds: number;
}

export const MOCK_TEST_INFO: TestInfo = {
  title: 'The Scholarly Curator',
  subtitle: 'EXAMINATION II',
  description: 'Translate the target words and provide optional synonyms.',
  totalQuestions: 60,
  durationSeconds: 45 * 60,
};

export const MOCK_VOCAB_ITEMS: TestVocabItem[] = [
  {
    id: 1,
    word: 'Ubiquitous',
    korMeaning: '어디에나 있는',
    engMeaning: 'present everywhere',
    synonymAnswer: 'omnipresent, omnipresent, omnipresent',
  },
  {
    id: 2,
    word: 'Ephemeral',
    korMeaning: '수명이 짧은',
    engMeaning: 'lasting for a short time',
    synonymAnswer: 'transient',
  },
  {
    id: 3,
    word: 'persuade',
    korMeaning: '설득하다, 납득시키다',
    engMeaning:
      'to cause someone to agree or do something through reasoning or encouragement. to cause someone to agree or do something through reasoning or encouragement.',
    synonymAnswer: 'convince',
  },
  {
    id: 4,
    word: 'Lugubrious',
    korMeaning: '침울한',
    engMeaning: 'looking or sounding sad and dismal',
    synonymAnswer: 'mournful',
  },
  {
    id: 5,
    word: 'Reticent',
    korMeaning: '과묵한',
    engMeaning: 'not revealing thoughts or feelings readily',
    synonymAnswer: 'reserved',
  },
  {
    id: 6,
    word: 'Loquacious',
    korMeaning: '수다스러운',
    engMeaning: 'tending to talk a great deal',
    synonymAnswer: 'talkative',
  },
  {
    id: 7,
    word: 'Pernicious',
    korMeaning: '해로운',
    engMeaning: 'having a harmful effect',
    synonymAnswer: 'detrimental',
  },
  {
    id: 8,
    word: 'Sanguine',
    korMeaning: '낙관적인',
    engMeaning: 'optimistic, especially in a difficult situation',
    synonymAnswer: 'optimistic',
  },
  {
    id: 9,
    word: 'Assiduous',
    korMeaning: '근면한',
    engMeaning: 'showing great care and perseverance',
    synonymAnswer: 'diligent',
  },
  {
    id: 10,
    word: 'Fastidious',
    korMeaning: '까다로운',
    engMeaning: 'very attentive to detail',
    synonymAnswer: 'meticulous',
  },
  {
    id: 11,
    word: 'Obfuscate',
    korMeaning: '모호하게 하다',
    engMeaning: 'to make unclear or confusing',
    synonymAnswer: 'obscure',
  },
  {
    id: 12,
    word: 'Capricious',
    korMeaning: '변덕스러운',
    engMeaning: 'given to sudden changes of mood',
    synonymAnswer: 'fickle',
  },
  {
    id: 13,
    word: 'Esoteric',
    korMeaning: '난해한',
    engMeaning: 'intended for a small, specialized group',
    synonymAnswer: 'arcane',
  },
  {
    id: 14,
    word: 'Pedantic',
    korMeaning: '현학적인',
    engMeaning: 'overly concerned with minor details',
    synonymAnswer: 'nitpicky',
  },
  {
    id: 15,
    word: 'Ostentatious',
    korMeaning: '과시적인',
    engMeaning: 'characterized by vulgar display',
    synonymAnswer: 'showy',
  },
  {
    id: 16,
    word: 'Pragmatic',
    korMeaning: '실용적인',
    engMeaning: 'dealing with things sensibly and realistically',
    synonymAnswer: 'practical',
  },
  {
    id: 17,
    word: 'Iconoclast',
    korMeaning: '인습 타파주의자',
    engMeaning: 'a person who attacks cherished beliefs',
    synonymAnswer: 'rebel',
  },
  {
    id: 18,
    word: 'Cacophony',
    korMeaning: '불협화음',
    engMeaning: 'a harsh, discordant mixture of sounds',
    synonymAnswer: 'discord',
  },
  {
    id: 19,
    word: 'Enervate',
    korMeaning: '기력을 빼앗다',
    engMeaning: 'to weaken physically or mentally',
    synonymAnswer: 'debilitate',
  },
  {
    id: 20,
    word: 'Alacrity',
    korMeaning: '민첩함',
    engMeaning: 'brisk and cheerful readiness',
    synonymAnswer: 'eagerness',
  },
  {
    id: 21,
    word: 'Perfidious',
    korMeaning: '불성실한',
    engMeaning: 'deceitful and untrustworthy',
    synonymAnswer: 'treacherous',
  },
  {
    id: 22,
    word: 'Mellifluous',
    korMeaning: '감미로운',
    engMeaning: 'sweet or musical; pleasant to hear',
    synonymAnswer: 'honeyed',
  },
  {
    id: 23,
    word: 'Vociferous',
    korMeaning: '소리 높여 외치는',
    engMeaning: 'expressing opinions loudly and forcefully',
    synonymAnswer: 'clamorous',
  },
  {
    id: 24,
    word: 'Perspicacious',
    korMeaning: '통찰력 있는',
    engMeaning: 'having a ready insight; shrewd',
    synonymAnswer: 'shrewd',
  },
  {
    id: 25,
    word: 'Recalcitrant',
    korMeaning: '반항적인',
    engMeaning: 'having an obstinately uncooperative attitude',
    synonymAnswer: 'defiant',
  },
  {
    id: 26,
    word: 'Truculent',
    korMeaning: '호전적인',
    engMeaning: 'eager or quick to argue or fight',
    synonymAnswer: 'aggressive',
  },
  {
    id: 27,
    word: 'Magnanimous',
    korMeaning: '관대한',
    engMeaning: 'generous or forgiving, especially to rivals',
    synonymAnswer: 'generous',
  },
  {
    id: 28,
    word: 'Quixotic',
    korMeaning: '비현실적인',
    engMeaning: 'exceedingly idealistic; unrealistic',
    synonymAnswer: 'idealistic',
  },
  {
    id: 29,
    word: 'Tenacious',
    korMeaning: '끈질긴',
    engMeaning: 'tending to keep a firm hold; persistent',
    synonymAnswer: 'persistent',
  },
  {
    id: 30,
    word: 'Nefarious',
    korMeaning: '극악한',
    engMeaning: 'wicked or criminal',
    synonymAnswer: 'wicked',
  },
  {
    id: 31,
    word: 'Inimical',
    korMeaning: '적대적인',
    engMeaning: 'tending to obstruct or harm; hostile',
    synonymAnswer: 'hostile',
  },
  {
    id: 32,
    word: 'Querulous',
    korMeaning: '불평이 많은',
    engMeaning: 'complaining in a petulant way',
    synonymAnswer: 'complaining',
  },
  {
    id: 33,
    word: 'Pugnacious',
    korMeaning: '싸움을 좋아하는',
    engMeaning: 'eager or quick to argue or fight',
    synonymAnswer: 'belligerent',
  },
  {
    id: 34,
    word: 'Volatile',
    korMeaning: '변동이 심한',
    engMeaning: 'liable to change rapidly and unpredictably',
    synonymAnswer: 'unstable',
  },
  {
    id: 35,
    word: 'Mendacious',
    korMeaning: '거짓말하는',
    engMeaning: 'not telling the truth; lying',
    synonymAnswer: 'dishonest',
  },
  {
    id: 36,
    word: 'Inveterate',
    korMeaning: '뿌리 깊은',
    engMeaning: 'having a habit too firmly established to change',
    synonymAnswer: 'habitual',
  },
  {
    id: 37,
    word: 'Trepidation',
    korMeaning: '두려움',
    engMeaning: 'a feeling of fear or anxiety',
    synonymAnswer: 'anxiety',
  },
  {
    id: 38,
    word: 'Obsequious',
    korMeaning: '아부하는',
    engMeaning: 'obedient or attentive to an excessive degree',
    synonymAnswer: 'sycophantic',
  },
  {
    id: 39,
    word: 'Circumspect',
    korMeaning: '신중한',
    engMeaning: 'wary and unwilling to take risks',
    synonymAnswer: 'cautious',
  },
  {
    id: 40,
    word: 'Discordant',
    korMeaning: '불화하는',
    engMeaning: 'disagreeing or incongruous',
    synonymAnswer: 'conflicting',
  },
  {
    id: 41,
    word: 'Insolent',
    korMeaning: '무례한',
    engMeaning: 'showing a rude lack of respect',
    synonymAnswer: 'impudent',
  },
  {
    id: 42,
    word: 'Vivacious',
    korMeaning: '활기찬',
    engMeaning: 'attractively lively and animated',
    synonymAnswer: 'lively',
  },
  {
    id: 43,
    word: 'Desolate',
    korMeaning: '황량한',
    engMeaning: 'feeling or showing misery or loneliness',
    synonymAnswer: 'barren',
  },
  {
    id: 44,
    word: 'Ambivalent',
    korMeaning: '양가감정의',
    engMeaning: 'having mixed feelings about something',
    synonymAnswer: 'conflicted',
  },
  {
    id: 45,
    word: 'Belligerent',
    korMeaning: '호전적인',
    engMeaning: 'hostile and aggressive',
    synonymAnswer: 'aggressive',
  },
  {
    id: 46,
    word: 'Candid',
    korMeaning: '솔직한',
    engMeaning: 'truthful and straightforward',
    synonymAnswer: 'frank',
  },
  {
    id: 47,
    word: 'Dogmatic',
    korMeaning: '독단적인',
    engMeaning: 'inclined to lay down principles as undeniably true',
    synonymAnswer: 'doctrinaire',
  },
  {
    id: 48,
    word: 'Enigmatic',
    korMeaning: '수수께끼 같은',
    engMeaning: 'difficult to interpret or understand',
    synonymAnswer: 'mysterious',
  },
  {
    id: 49,
    word: 'Garrulous',
    korMeaning: '수다스러운',
    engMeaning: 'excessively talkative, especially on trivial matters',
    synonymAnswer: 'chatty',
  },
  {
    id: 50,
    word: 'Laconic',
    korMeaning: '간결한',
    engMeaning: 'using very few words',
    synonymAnswer: 'brief',
  },
];

export const ITEMS_PER_PAGE = 10;
