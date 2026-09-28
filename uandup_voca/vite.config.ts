import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
    }),
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    // 홈 화면에 "앱처럼" 설치하기 위한 manifest + 서비스 워커.
    // 크롬이 설치 버튼을 띄우려면 manifest와 fetch 핸들러를 가진 서비스 워커가 둘 다 필요하다.
    VitePWA({
      // 새 버전을 배포하면 서비스 워커가 스스로 교체된다. 사용자에게 "새로고침하세요"를
      // 묻지 않는 대신, 다음 실행 때 최신 번들이 적용된다.
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png"],
      manifest: {
        name: "learnvocably",
        short_name: "Vocably",
        description: "Review your assigned words, review deck, and personal words.",
        // 설치된 앱은 항상 모바일 단어 화면에서 시작한다.
        // 로그인 전이면 /m의 가드가 랜딩(/)으로 보내므로 안전하다.
        start_url: "/m",
        // 스코프는 루트로 둔다 — "Use desktop site"로 /student에 갔을 때도 앱 창 안에 머문다.
        scope: "/",
        id: "/",
        display: "standalone",
        orientation: "portrait",
        // 스플래시 배경은 앱 표면색(--color-surface)과 맞춰 전환이 매끄럽게 보이게 한다.
        background_color: "#faf8ff",
        // 안드로이드 상태바 색. 브랜드 네이비라 흰 상태바 글자가 잘 읽힌다.
        theme_color: "#001b5f",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          // 안드로이드는 아이콘을 원형·둥근사각 등으로 잘라내므로 여백이 넉넉한 버전을 따로 준다.
          { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // 빌드 산출물(해시 붙은 JS/CSS/폰트/이미지)만 precache한다.
        globPatterns: ["**/*.{js,css,html,svg,png,woff,woff2}"],
        // SPA 라우팅 — 캐시된 index.html로 폴백해야 /m/words/review 같은 주소가 오프라인에서도 뜬다.
        navigateFallback: "/index.html",
        // **API는 절대 서비스 워커를 거치지 않는다.**
        // 이 앱은 JWT 기반이고 데이터가 학생별이라, API 응답을 캐시하면 로그아웃 후 다른 계정에
        // 이전 학생 데이터가 보이거나 철 지난 성적이 노출될 수 있다.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [],
      },
      // 서비스 워커는 빌드(build/preview)에서만 동작한다.
      // dev에서 켜면 HMR과 캐시가 엉켜 디버깅이 어려워지므로 끈다 — 설치 테스트는 npm run preview로.
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
