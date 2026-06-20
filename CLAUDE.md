# CLAUDE.md

이 파일은 이 레포지토리에서 작업할 때 Claude Code(claude.ai/code)에게 제공되는 가이드입니다.

## 한 문장으로 보는 이 프로젝트

선생님이 학생에게 단어(Word)를 **StudySet** 단위로 배정하면, 학생은 한 StudySet당 **5단계 사이클**(Word → Sentence → Review 1/2/3)을 거치며 시험을 보고, 오답은 **ReviewDeck**에 누적되며, 별도로 **LevelTest**로 수준 평가를 받는 영어 어휘 학습 SaaS.

## 프로젝트 구조

실제 앱은 `uandup_voca/` 디렉토리 안에 있습니다. 아래 모든 명령어는 해당 디렉토리에서 실행해야 합니다.

```
voca-front/
└── uandup_voca/      ← npm 프로젝트 루트
    ├── src/
    │   ├── app/          ← 자동 생성 라우트 트리(routeTree.gen.ts — 직접 수정 금지) + QueryProvider
    │   ├── routes/       ← TanStack Router 파일 기반 라우트 (URL ↔ 페이지 매핑 + 가드 + search param)
    │   ├── pages/        ← 페이지 컴포넌트 (역할/페이지명 단위)
    │   ├── widgets/      ← 2개 이상 페이지가 재사용하는 큰 UI 블록
    │   ├── features/     ← 여러 entity를 가로지르는 user action (mutation 묶음)
    │   ├── entities/     ← 도메인 객체 (Word, Student, Exam, …)
    │   └── shared/       ← 비즈니스 모르는 generic 인프라 (Modal, axios, …)
```

## 명령어

모든 명령어는 `uandup_voca/`에서 실행합니다:

```bash
npm run dev          # 개발 서버 (Vite)
npm run build        # tsc + vite 빌드
npm run lint         # ESLint
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷
npm run gen:api      # openapi-typescript로 schema.gen.ts 재생성
npm run preview      # 프로덕션 빌드 미리보기
```

## 도메인 사전

| 용어           | 뜻                                                                                                            | 위치                               |
| -------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Member**     | 최상위 사용자 (`STUDENT` / `TEACHER` / `PARENT`) + 상태(`PROFILE_INCOMPLETE` / `PENDING_APPROVAL` / `ACTIVE`) | `entities/member`                  |
| **Admin**      | `isAdmin=true`인 `TEACHER`. 별도 역할이 **아님**                                                              | `entities/teacher`                 |
| **Auth**       | JWT 디코딩 및 현재 세션 식별 hook (`useCurrentStudentId`, `useActiveChildId`, `useIsReadOnly` 등)             | `entities/auth`                    |
| **Word**       | 어휘 한 단어 (level 1~10, 품사, 한/영 뜻, 동의어, 예문)                                                       | `entities/word`                    |
| **StudySet**   | 학생에게 한 번에 배정된 단어 묶음. **5단계 시험 사이클의 단위**                                               | `entities/student`의 `StudySetRow` |
| **Step**       | StudySet의 한 단계: `Word` / `Sentence` / `Review 1` / `Review 2` / `Review 3` (5개 고정)                     | `entities/test`의 `StepCardVM`     |
| **Exam**       | 시험 인스턴스. Step당 1개 또는 ReviewDeck/LevelTest 별개                                                      | `entities/test`의 `ExamDetail`     |
| **ReviewDeck** | 학생별 누적 오답 뱅크                                                                                         | `entities/review-deck`             |
| **LevelTest**  | StudySet과 무관한 학생 단위 수준평가                                                                          | `entities/level-test`              |
| **Clinic**     | 선생님의 수업 슬롯 (예: MON 13:00). 학생이 소속됨                                                             | `entities/clinic`                  |
| **Memo**       | 선생님이 학생에게 다는 노트                                                                                   | `entities/memo`                    |

**세 시험 패밀리** — `submit/start/cancel` 액션은 `entities/test` 공통. list/create는 각 entity 별개:

1. **Step exam** — `entities/test` + `features/exam`
2. **ReviewDeck exam** — `entities/review-deck` + `features/review-deck-exam`
3. **LevelTest exam** — `entities/level-test` + `features/level-test-exam`

## 레이어 헌장

FSD(Feature-sliced-design) 아키텍쳐. 위로 갈수록 비즈니스를 많이 안다. **아래 레이어로 가는 import만 허용**.

| 레이어        | 역할                                                                  | 입주 조건 / 금지                                               |
| ------------- | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| **app/**      | 앱 부팅 인프라 (QueryProvider, 글로벌 스타일)                         | 모든 페이지 공유 단 하나의 인프라. 비즈니스 로직 ❌            |
| **routes/**   | URL ↔ Page 매핑 + 가드 + search param 검증                            | TanStack 파일 라우팅만. 비즈니스 로직 ❌                       |
| **pages/**    | 한 라우트의 화면 한 덩어리. 페이지 전용 hook/mapper/types/sub-UI 모두 | **다른 페이지가 import하면 안 됨**                             |
| **widgets/**  | 2개 이상 페이지가 재사용하는 큰 UI 블록                               | 한 페이지에서만 쓰이면 widgets ❌ → pages로                    |
| **features/** | 여러 entity 가로지르는 user action (mutation 묶음 + 선택적 UI)        | 단일 entity의 query만 하면 features ❌ → entities로            |
| **entities/** | 도메인 객체. `model` / `api` / `ui` / `lib` 세그먼트                  | 같은 레이어 직접 import 금지 — `@x/{other}` 게이트만 허용      |
| **shared/**   | 비즈니스 모름. Modal, DataTable, axiosInstance 같은 generic 인프라    | **도메인 타입 import 금지** (MemberRole/ExamStatus 같은 거 ❌) |

## 새 코드를 어디 놓을지 — 결정 트리

```
1. 비즈니스를 전혀 안 봐도 동작? ─Yes→ shared/
2. 단일 도메인 객체 표현 / fetch / mapper? ─Yes→ entities/{domain}
3. 여러 entity 동시에 건드리는 mutation? UI 있는 user-action? ─Yes→ features/{action}
4. 2개 이상 페이지가 같은 UI 블록 재사용? ─Yes→ widgets/{block}
5. 그 외 모두 → pages/{role}/{name}
```

## 영향 범위 (Blast Radius) — 고치면 어디가 깨지나

| 고치는 곳    | 깨질 수 있는 곳                     |
| ------------ | ----------------------------------- |
| `shared/`    | 전 코드베이스                       |
| `entities/X` | X를 쓰는 모든 페이지·feature·widget |
| `features/X` | X를 쓰는 페이지·widget              |
| `widgets/X`  | X를 쓰는 페이지들                   |
| `pages/X`    | **X 자기 자신만**                   |

## 인증

- `shared/api/axiosInstance.ts`: `localStorage`의 `accessToken`을 모든 요청에 첨부. 401 시 토큰 제거 + `/` 리다이렉트.
- 백엔드 베이스 URL은 `VITE_API_BASE_URL` 환경변수.
- 경로 별칭 `@/`는 `src/`를 가리킵니다.

## 스타일링

**Tailwind CSS v4**. `src/index.css`의 `@theme` 블록에 Material Design 3 기반 커스텀 토큰 시스템 정의. 원시 색상 대신 시맨틱 토큰(`bg-surface`, `text-on-surface`, `bg-primary`, `border-outline-variant` 등)을 사용. 아이콘은 **Material Symbols Outlined** (Google Fonts).

## 모달 정책

공통 동작은 `shared/ui/Modal`에 위임. 모든 모달은 다음을 따릅니다:

- **백드롭 클릭 → 닫힘** / **ESC 키 → 닫히지 않음** / **Body scroll lock**
- Header / Body / Footer 슬롯 구성

예외:

- `widgets/test-offline/`의 print-sheet 모달 6개는 인쇄용 별도 패턴 — `shared/ui/Modal` 사용 안 함
- `pages/teacher/clinic-detail/ui/WordTestTab/modals/`의 `TestGradingModal` / `TestPrintModal` / `TestResultModal`은 모달이 아니라 step 종류에 따라 print-sheet를 고르는 **conditional renderer**

## API 연동 규칙

UI 컴포넌트는 `schema.gen.ts`를 직접 참조하지 않습니다. 반드시 아래 흐름:

```
API response (schema.gen.ts) → mapper → 클라이언트 타입 (model/types.ts) → UI
```

- `model/mapper.ts`: `schema.gen.ts` → 클라이언트 타입. hook의 `select` 옵션으로 적용.
- `api/mapper.ts`: 클라이언트 타입 → `schema.gen.ts` (요청 페이로드용).
- API 함수는 `axiosInstance` + `.then((r) => r.data)`로 `Promise<ApiResponse<T>>` 반환.
- 캐시 무효화: 각 entity의 `api/invalidate.ts`에 cascade 함수 정의. 여러 entity를 cross-cutting하는 mutation은 `features/`에 위치.

## **반드시 지켜야 할 점**

- 단순히 문제 해결에 급급한 코드를 작성하지 마십시오. 더 효율적인 대안들에 대해 생각해야 하며, 작성하는 코드에 대한 근거와 이유를 설명합니다.
- 모든 화면 문구는 영어로 표시합니다.
- lint / prettier / 포맷 경고는 무시합니다.
- **주석을 제거하지 마세요.** 기존 주석은 그대로 보존합니다.
- 같은 이름의 컴포넌트가 다른 경로에 중복되지 않게 합니다. 도메인을 드러내는 이름을 사용하세요 (예: `StepCard` ❌ → `WordTestStepCard` / `ClinicStepCard` ✓).
