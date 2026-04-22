export type TestType = 'Meaning to Word' | 'Word to Meaning';

export interface TestConfig {
  type: TestType;
  includeSynonyms: boolean;
}
