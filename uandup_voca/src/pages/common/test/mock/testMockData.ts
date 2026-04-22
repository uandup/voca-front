export interface TestVocabItem {
  id: number;
  word: string;
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
  { id: 1, word: 'Ubiquitous' },
  { id: 2, word: 'Ephemeral' },
  { id: 3, word: 'Sycophant' },
  { id: 4, word: 'Lugubrious' },
  { id: 5, word: 'Reticent' },
  { id: 6, word: 'Loquacious' },
  { id: 7, word: 'Pernicious' },
  { id: 8, word: 'Sanguine' },
  { id: 9, word: 'Assiduous' },
  { id: 10, word: 'Fastidious' },
  { id: 11, word: 'Obfuscate' },
  { id: 12, word: 'Capricious' },
  { id: 13, word: 'Esoteric' },
  { id: 14, word: 'Pedantic' },
  { id: 15, word: 'Ostentatious' },
  { id: 16, word: 'Pragmatic' },
  { id: 17, word: 'Iconoclast' },
  { id: 18, word: 'Cacophony' },
  { id: 19, word: 'Enervate' },
  { id: 20, word: 'Alacrity' },
  { id: 21, word: 'Perfidious' },
  { id: 22, word: 'Mellifluous' },
  { id: 23, word: 'Sanguine' },
  { id: 24, word: 'Vociferous' },
  { id: 25, word: 'Perspicacious' },
  { id: 26, word: 'Recalcitrant' },
  { id: 27, word: 'Loquacious' },
  { id: 28, word: 'Truculent' },
  { id: 29, word: 'Magnanimous' },
  { id: 30, word: 'Quixotic' },
  { id: 31, word: 'Tenacious' },
  { id: 32, word: 'Nefarious' },
  { id: 33, word: 'Ephemeral' },
  { id: 34, word: 'Inimical' },
  { id: 35, word: 'Querulous' },
  { id: 36, word: 'Pugnacious' },
  { id: 37, word: 'Volatile' },
  { id: 38, word: 'Mendacious' },
  { id: 39, word: 'Inveterate' },
  { id: 40, word: 'Trepidation' },
  { id: 41, word: 'Obsequious' },
  { id: 42, word: 'Circumspect' },
  { id: 43, word: 'Discordant' },
  { id: 44, word: 'Insolent' },
  { id: 45, word: 'Vivacious' },
  { id: 46, word: 'Desolate' },
  { id: 47, word: 'Ambivalent' },
  { id: 48, word: 'Belligerent' },
  { id: 49, word: 'Candid' },
  { id: 50, word: 'Dogmatic' },
  // { id: 51, word: 'Enigmatic' },
  // { id: 52, word: 'Frugal' },
  // { id: 53, word: 'Garrulous' },
  // { id: 54, word: 'Hapless' },
  // { id: 55, word: 'Indolent' },
  // { id: 56, word: 'Jocular' },
  // { id: 57, word: 'Laconic' },
  // { id: 58, word: 'Morose' },
  // { id: 59, word: 'Nebulous' },
  // { id: 60, word: 'Opulent' },
];

export const ITEMS_PER_PAGE = 10;
