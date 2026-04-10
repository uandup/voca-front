export type TestType = 'W→EN' | 'W→KR' | 'M→W';

export interface TestConfig {
  type: TestType;
  includeSynonyms: boolean;
}
