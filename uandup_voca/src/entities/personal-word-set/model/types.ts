// 세트를 만든 주체. 서버가 memberId가 아니라 역할만 내려준다 — 화면이 필요한 건
// "학생이 추가" / "선생님이 추가" 표시뿐이고, memberId면 목록을 그릴 때마다 조회가 붙는다.
export type PersonalWordSetCreatorRole = 'STUDENT' | 'TEACHER';

// 개인 단어 세트 목록의 한 행. 이름으로 식별되는 리소스라 StudySetRow(레벨+단어수+배정일로
// 식별)와 달리 라벨을 조합할 필요가 없다.
export interface PersonalWordSetRow {
  id: number;
  name: string;
  createdByRole: PersonalWordSetCreatorRole;
  // 세트에 속한 활성 단어 수. 서버가 집계해 내려준다(세트당 단어 목록을 따로 조회하지 않는다).
  wordCount: number;
  createdAt: string;
}

// 세트 생성·이름 변경 폼 값 — 이름 하나뿐이다.
export interface PersonalWordSetFormData {
  name: string;
}
