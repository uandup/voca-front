# CLAUDE.md

이 파일은 이 레포지토리에서 작업할 때 Claude Code(claude.ai/code)에게 제공되는 가이드입니다.

## 프로젝트 구조

실제 앱은 `uandup_voca/` 디렉토리 안에 있습니다. 아래 모든 명령어는 해당 디렉토리에서 실행해야 합니다.

```
voca-front/
└── uandup_voca/      ← npm 프로젝트 루트
    ├── src/
    │   ├── app/          ← 자동 생성 라우트 트리 (routeTree.gen.ts — 직접 수정 금지)
    │   ├── routes/       ← TanStack Router 파일 기반 라우트
    │   ├── pages/        ← 페이지 컴포넌트 (라우트별 폴더)
    │   ├── features/     ← 독립 기능 슬라이스 (예: roster-manage)
    │   ├── entities/     ← 공유 도메인 타입 + UI (vocab, student)
    │   └── shared/       ← 공통 UI (navBar, 모달, API 클라이언트)
    └── stitch/           ← 정적 HTML 디자인 목업 (참고용, 사용자가 요구하는 것 아니면 확인 x)
```

## 명령어

모든 명령어는 `uandup_voca/`에서 실행합니다:

```bash
cd uandup_voca

npm run dev       # 개발 서버 실행 (Vite)
npm run build     # tsc + vite 빌드
npm run lint      # ESLint
npm run preview   # 프로덕션 빌드 미리보기
```

테스트는 아직 설정되어 있지 않습니다.

## 아키텍처

### 라우팅

**TanStack Router**의 파일 기반 라우팅을 사용합니다. 라우트 트리는 Vite 플러그인이 `src/app/routeTree.gen.ts`에 자동 생성하므로 직접 수정하지 마세요.

라우트 계층:

- `/` → `/login`으로 리다이렉트
- `/login` → Google OAuth 진입점
- `/onboarding` → 로그인 후 회원가입 (학생 / 학부모 / 선생님 역할 선택)
- `/pending` → 관리자 승인 대기 페이지
- `/teacher/*` → 선생님 레이아웃 (`TeacherSideNavBar`, `ml-64` 콘텐츠 영역)
- `/student/*` → 학생 레이아웃 (`StudentSideNavBar`, `ml-64` 콘텐츠 영역)

경로 별칭 `@/`는 `src/`를 가리킵니다.

### 인증

`src/shared/api/axiosInstance.ts`에서 인증을 처리합니다:

- `localStorage`의 `accessToken`을 읽어 모든 요청에 `Authorization: Bearer ...`로 첨부합니다.
- 401 응답 시 토큰을 제거하고 `/login`으로 리다이렉트합니다.
- 백엔드 베이스 URL은 `VITE_API_BASE_URL` 환경변수로 설정합니다.

### 스타일링

**Tailwind CSS v4**를 사용하며, `src/index.css`의 `@theme` 블록에 Material Design 3 기반 커스텀 토큰 시스템이 정의되어 있습니다. 원시 Tailwind 색상 대신 시맨틱 토큰(`bg-surface`, `text-on-surface`, `bg-primary`, `border-outline-variant` 등)을 사용하세요. 아이콘은 Google Fonts로 불러오는 **Material Symbols Outlined**를 사용합니다.

### 기능 슬라이스 구조

페이지는 `src/pages/<역할>/<기능>/` 구조로 정리되며 역할은 `teacher`,`student`,`common(어디에도 속하지 않거나 둘 다 포함되는 페이지)`, 내부에 `ui/`, `model/`,`api`,`lib` 서브폴더를 둡니다. 공유 도메인 로직은 `src/entities/`로 올려 배럴 `index.ts`로 내보냅니다. 페이지 간 공유 기능은 `src/features/`에 둡니다.

현재 대부분의 페이지는 `mock/` 폴더의 로컬 목업 데이터를 사용하며, 실제 API 연동은 진행 중입니다.

### 주요 도메인 타입

- `Vocab` (`src/entities/vocab/types/vocab.ts`) — word, partOfSpeech, koreanMeaning, difficultyLevel(1–4), englishMeaning, synonyms, exampleSentence
- 사용자 역할: `학생` | `학부모` | `선생님` | `관리자`
