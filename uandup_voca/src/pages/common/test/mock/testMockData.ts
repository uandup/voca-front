export type TestType = 'word-to-meaning' | 'meaning-to-word';

export interface TestVocabItem {
  id: number;
  word: string;
  korMeaning: string;
  engMeaning: string;
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
  { id: 1, word: 'Ubiquitous', korMeaning: '어디에나 있는', engMeaning: 'present everywhere' },
  { id: 2, word: 'Ephemeral', korMeaning: '수명이 짧은', engMeaning: 'lasting for a short time' },
  {
    id: 3,
    word: 'Sycophant',
    korMeaning: '아첨꾼',
    engMeaning: 'a person who flatters to gain favor',
  },
  {
    id: 4,
    word: 'Lugubrious',
    korMeaning: '침울한',
    engMeaning: 'looking or sounding sad and dismal',
  },
  {
    id: 5,
    word: 'Reticent',
    korMeaning: '과묵한',
    engMeaning: 'not revealing thoughts or feelings readily',
  },
  {
    id: 6,
    word: 'Loquacious',
    korMeaning: '수다스러운',
    engMeaning: 'tending to talk a great deal',
  },
  { id: 7, word: 'Pernicious', korMeaning: '해로운', engMeaning: 'having a harmful effect' },
  {
    id: 8,
    word: 'Sanguine',
    korMeaning: '낙관적인',
    engMeaning: 'optimistic, especially in a difficult situation',
  },
  {
    id: 9,
    word: 'Assiduous',
    korMeaning: '근면한',
    engMeaning: 'showing great care and perseverance',
  },
  { id: 10, word: 'Fastidious', korMeaning: '까다로운', engMeaning: 'very attentive to detail' },
  {
    id: 11,
    word: 'Obfuscate',
    korMeaning: '모호하게 하다',
    engMeaning: 'to make unclear or confusing',
  },
  {
    id: 12,
    word: 'Capricious',
    korMeaning: '변덕스러운',
    engMeaning: 'given to sudden changes of mood',
  },
  {
    id: 13,
    word: 'Esoteric',
    korMeaning: '난해한',
    engMeaning: 'intended for a small, specialized group',
  },
  {
    id: 14,
    word: 'Pedantic',
    korMeaning: '현학적인',
    engMeaning: 'overly concerned with minor details',
  },
  {
    id: 15,
    word: 'Ostentatious',
    korMeaning: '과시적인',
    engMeaning: 'characterized by vulgar display',
  },
  {
    id: 16,
    word: 'Pragmatic',
    korMeaning: '실용적인',
    engMeaning: 'dealing with things sensibly and realistically',
  },
  {
    id: 17,
    word: 'Iconoclast',
    korMeaning: '인습 타파주의자',
    engMeaning: 'a person who attacks cherished beliefs',
  },
  {
    id: 18,
    word: 'Cacophony',
    korMeaning: '불협화음',
    engMeaning: 'a harsh, discordant mixture of sounds',
  },
  {
    id: 19,
    word: 'Enervate',
    korMeaning: '기력을 빼앗다',
    engMeaning: 'to weaken physically or mentally',
  },
  { id: 20, word: 'Alacrity', korMeaning: '민첩함', engMeaning: 'brisk and cheerful readiness' },
  { id: 21, word: 'Perfidious', korMeaning: '불성실한', engMeaning: 'deceitful and untrustworthy' },
  {
    id: 22,
    word: 'Mellifluous',
    korMeaning: '감미로운',
    engMeaning: 'sweet or musical; pleasant to hear',
  },
  {
    id: 23,
    word: 'Vociferous',
    korMeaning: '소리 높여 외치는',
    engMeaning: 'expressing opinions loudly and forcefully',
  },
  {
    id: 24,
    word: 'Perspicacious',
    korMeaning: '통찰력 있는',
    engMeaning: 'having a ready insight; shrewd',
  },
  {
    id: 25,
    word: 'Recalcitrant',
    korMeaning: '반항적인',
    engMeaning: 'having an obstinately uncooperative attitude',
  },
  {
    id: 26,
    word: 'Truculent',
    korMeaning: '호전적인',
    engMeaning: 'eager or quick to argue or fight',
  },
  {
    id: 27,
    word: 'Magnanimous',
    korMeaning: '관대한',
    engMeaning: 'generous or forgiving, especially to rivals',
  },
  {
    id: 28,
    word: 'Quixotic',
    korMeaning: '비현실적인',
    engMeaning: 'exceedingly idealistic; unrealistic',
  },
  {
    id: 29,
    word: 'Tenacious',
    korMeaning: '끈질긴',
    engMeaning: 'tending to keep a firm hold; persistent',
  },
  { id: 30, word: 'Nefarious', korMeaning: '극악한', engMeaning: 'wicked or criminal' },
  {
    id: 31,
    word: 'Inimical',
    korMeaning: '적대적인',
    engMeaning: 'tending to obstruct or harm; hostile',
  },
  {
    id: 32,
    word: 'Querulous',
    korMeaning: '불평이 많은',
    engMeaning: 'complaining in a petulant way',
  },
  {
    id: 33,
    word: 'Pugnacious',
    korMeaning: '싸움을 좋아하는',
    engMeaning: 'eager or quick to argue or fight',
  },
  {
    id: 34,
    word: 'Volatile',
    korMeaning: '변동이 심한',
    engMeaning: 'liable to change rapidly and unpredictably',
  },
  {
    id: 35,
    word: 'Mendacious',
    korMeaning: '거짓말하는',
    engMeaning: 'not telling the truth; lying',
  },
  {
    id: 36,
    word: 'Inveterate',
    korMeaning: '뿌리 깊은',
    engMeaning: 'having a habit too firmly established to change',
  },
  { id: 37, word: 'Trepidation', korMeaning: '두려움', engMeaning: 'a feeling of fear or anxiety' },
  {
    id: 38,
    word: 'Obsequious',
    korMeaning: '아부하는',
    engMeaning: 'obedient or attentive to an excessive degree',
  },
  {
    id: 39,
    word: 'Circumspect',
    korMeaning: '신중한',
    engMeaning: 'wary and unwilling to take risks',
  },
  { id: 40, word: 'Discordant', korMeaning: '불화하는', engMeaning: 'disagreeing or incongruous' },
  { id: 41, word: 'Insolent', korMeaning: '무례한', engMeaning: 'showing a rude lack of respect' },
  {
    id: 42,
    word: 'Vivacious',
    korMeaning: '활기찬',
    engMeaning: 'attractively lively and animated',
  },
  {
    id: 43,
    word: 'Desolate',
    korMeaning: '황량한',
    engMeaning: 'feeling or showing misery or loneliness',
  },
  {
    id: 44,
    word: 'Ambivalent',
    korMeaning: '양가감정의',
    engMeaning: 'having mixed feelings about something',
  },
  { id: 45, word: 'Belligerent', korMeaning: '호전적인', engMeaning: 'hostile and aggressive' },
  { id: 46, word: 'Candid', korMeaning: '솔직한', engMeaning: 'truthful and straightforward' },
  {
    id: 47,
    word: 'Dogmatic',
    korMeaning: '독단적인',
    engMeaning: 'inclined to lay down principles as undeniably true',
  },
  {
    id: 48,
    word: 'Enigmatic',
    korMeaning: '수수께끼 같은',
    engMeaning: 'difficult to interpret or understand',
  },
  {
    id: 49,
    word: 'Garrulous',
    korMeaning: '수다스러운',
    engMeaning: 'excessively talkative, especially on trivial matters',
  },
  { id: 50, word: 'Laconic', korMeaning: '간결한', engMeaning: 'using very few words' },
];

export const ITEMS_PER_PAGE = 10;
