import type { components } from '@/shared/api/schema.gen';
import type {
  PersonalExamDetailResponse,
  PersonalExamAttemptResponse,
  PersonalExamSummaryResponse,
  PersonalExamItemDetail,
  PersonalExamAttemptItem as PersonalExamAttemptItemRaw,
  CreatePersonalExamRequest,
  SubmitPersonalExamRequest,
} from '../api/personalExamApi';
import type { PersonalExamRow, PersonalExamStatus, CreatePersonalExamPayload } from './types';

// entities/test의 submitExam이 받는 요청 바디와 같은 모양 — features/exam의 useSubmitExam이
// source='personal'일 때 이 타입으로 페이로드를 받아 아래 toSubmitPersonalExamRequest로 변환한다.
type SubmitExamRequest = components['schemas']['SubmitExamRequest'];
import type {
  ExamDetail,
  ExamItem,
  ExamAttemptData,
  ExamAttemptItem,
} from '@/entities/test/@x/personal-exam';
import { toWordTestType, toExamSubType } from '@/entities/test/@x/personal-exam';

// PersonalExamItemDetail → entities/test의 ExamItem.
// 개인단어장은 영영뜻(englishMeaning)·동의어(synonyms)·예문(example) 개념이 없어 빈 값으로
// 채운다 — VocabAnswerTable/VocabReviewTable 등 기존 위젯이 요구하는 필드 형태만 맞추기 위함.
function toExamItem(item: PersonalExamItemDetail): ExamItem {
  return {
    examItemId: item.personalExamItemId ?? 0,
    itemOrder: item.itemOrder ?? 0,
    word: item.word ?? '',
    koreanMeaning: item.koreanMeaning ?? '',
    englishMeaning: '',
    synonyms: [],
    example: '',
    isCorrect: item.isCorrect ?? null,
    userAnswer: item.userAnswer ?? null,
    synonymUserAnswers: [],
  };
}

// PersonalExamDetailResponse → entities/test의 ExamDetail. examType(=PERSONAL)은 라우트
// search param으로 이미 알고 있으므로 이 변환에는 필요 없다(entities/test의 toExamDetail도
// 서버 type 필드를 쓰지 않는 것과 동일한 이유).
export function toPersonalExamDetail(r: PersonalExamDetailResponse): ExamDetail {
  return {
    examId: r.personalExamId ?? 0,
    // study-set 개념이 없는 시험이라 undefined로 둔다 — ExamDetail.studySetId가 optional로
    // 바뀌어 있어야 한다(entities/test 1단계 변경 참고).
    studySetId: undefined,
    subType: r.subType ? toWordTestType(r.subType) : null,
    includeSynonym: false,
    status: r.status ?? '',
    isPassed: r.isPassed ?? null,
    violationCount: r.violationCount ?? null,
    items: (r.items ?? []).map(toExamItem).sort((a, b) => a.itemOrder - b.itemOrder),
  };
}

function toExamAttemptItem(item: PersonalExamAttemptItemRaw): ExamAttemptItem {
  return {
    examItemId: item.personalExamItemId ?? 0,
    itemOrder: item.itemOrder ?? 0,
    word: item.word ?? '',
    koreanMeaning: item.koreanMeaning ?? '',
    englishMeaning: '',
    example: '',
  };
}

// PersonalExamAttemptResponse → entities/test의 ExamAttemptData.
export function toPersonalExamAttemptData(r: PersonalExamAttemptResponse): ExamAttemptData {
  return {
    examId: r.personalExamId ?? 0,
    type: 'PERSONAL',
    subType: r.subType ? toWordTestType(r.subType) : null,
    includeSynonym: false,
    totalCount: r.totalCount ?? 0,
    items: (r.items ?? []).map(toExamAttemptItem).sort((a, b) => a.itemOrder - b.itemOrder),
    wordChoices: null,
  };
}

export function toPersonalExamRow(r: PersonalExamSummaryResponse): PersonalExamRow {
  return {
    personalExamId: r.personalExamId ?? 0,
    subType: r.subType ? toWordTestType(r.subType) : 'word-to-meaning',
    status: (r.status ?? 'READY') as PersonalExamStatus,
    totalCount: r.totalCount ?? 0,
    correctCount: r.correctCount ?? null,
    isPassed: r.isPassed ?? null,
  };
}

export function toCreatePersonalExamRequest(
  payload: CreatePersonalExamPayload,
): CreatePersonalExamRequest {
  return {
    startIndex: payload.startIndex,
    endIndex: payload.endIndex,
    subType: toExamSubType(payload.testType),
  };
}

// entities/test의 SubmitExamRequest(examItemId 기반) → PersonalExam 전용 요청
// (personalExamItemId 기반, synonymAnswer 없음). features/exam의 useSubmitExam이
// source='personal'일 때 호출부의 공용 페이로드를 그대로 받아 이 함수로 변환해 제출한다.
export function toSubmitPersonalExamRequest(payload: SubmitExamRequest): SubmitPersonalExamRequest {
  return {
    results: payload.results.map((r) => ({
      personalExamItemId: r.examItemId,
      wordAnswer: r.wordAnswer,
    })),
    violationCount: payload.violationCount,
  };
}
