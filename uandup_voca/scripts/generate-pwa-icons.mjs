// PWA 홈 화면 아이콘을 public/favicon.svg에서 생성한다.
//
// 기존 logo.png(1000x228)·voca.png(1688x602)는 가로형 배너라 아이콘으로 쓸 수 없다.
// PWA 아이콘은 정사각이어야 하므로 favicon(48x46)을 정사각 캔버스 가운데에 올린다.
//
// 로고가 변경되면 다시 실행: node scripts/generate-pwa-icons.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public');
const SOURCE = resolve(publicDir, 'favicon.svg');

// 캔버스 배경. 로고가 보라/하늘색 계열이라 흰 배경에서 가장 잘 읽힌다.
const BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 };

const TARGETS = [
  // purpose: 'any' — 런처가 아이콘을 그대로 쓴다. 여백을 적게 줘 로고를 크게 보여준다.
  { file: 'icon-192.png', size: 192, logoRatio: 0.78 },
  { file: 'icon-512.png', size: 512, logoRatio: 0.78 },
  // purpose: 'maskable' — 안드로이드가 원형·둥근사각 등으로 잘라낸다.
  // 안전 영역은 가운데 80% 원이므로 로고를 더 작게 넣어야 모서리가 잘려도 온전하다.
  { file: 'icon-maskable-512.png', size: 512, logoRatio: 0.55 },
];

// favicon.svg의 가로세로 비(48x46) — 긴 변을 기준으로 맞춘다.
const SRC_W = 48;
const SRC_H = 46;

for (const { file, size, logoRatio } of TARGETS) {
  const logoW = Math.round(size * logoRatio);
  const logoH = Math.round((logoW * SRC_H) / SRC_W);

  // density를 올려야 벡터가 선명하게 래스터된다 (기본 72dpi면 작게 렌더된 뒤 확대돼 뭉개진다).
  const logo = await sharp(SOURCE, { density: 384 })
    .resize(logoW, logoH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toFile(resolve(publicDir, file));

  console.log(`generated public/${file} (${size}x${size}, logo ${logoW}x${logoH})`);
}
