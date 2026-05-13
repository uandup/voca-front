// 메인 문서의 스타일을 그대로 가져와 인쇄용 HTML에 주입한다.
// Vite dev: <style> 태그로 inline 주입됨 / Vite build: <link rel="stylesheet">로 hashed CSS 파일 참조.
// 두 경우 모두 cover하기 위해 head 안의 link/style을 모두 복제한다.
function collectAppStyles(): string {
  return Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('\n');
}

function buildPrintHtml(sheetHtml: string, title = 'VOCAB TEST'): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    ${collectAppStyles()}
    <style>
      @page { size: A4; margin: 10mm 10mm; }
      body { margin: 0; padding: 0; background: white; }
      main, [id$="-print-sheet"] {
        width: 100% !important;
        height: 100% !important;
        min-height: unset !important;
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .print-page {
        width: 100%;
        height: 100vh;
        page-break-after: always;
        break-after: page;
        overflow: hidden;
        box-sizing: border-box;
      }
      .print-page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }
    </style>
  </head>
  <body>${sheetHtml}</body>
</html>`;
}

// iframe 안의 모든 <link rel="stylesheet">가 로드 완료될 때까지 기다린다.
// build 모드에서 CSS가 비동기 로드되므로 print()가 스타일 적용 전 발화하는 race를 방지.
async function waitForStylesheets(doc: Document): Promise<void> {
  const links = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
  if (links.length === 0) return;
  await Promise.all(
    links.map(
      (link) =>
        new Promise<void>((resolve) => {
          if ((link.sheet as CSSStyleSheet | null) !== null) return resolve();
          link.addEventListener('load', () => resolve(), { once: true });
          link.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  );
}

function triggerPrint(html: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.cssText =
    'position:fixed;top:0;left:0;width:0;height:0;border:none;visibility:hidden;';
  iframe.srcdoc = html;
  document.body.appendChild(iframe);

  iframe.onload = async () => {
    const doc = iframe.contentDocument;
    if (doc) await waitForStylesheets(doc);
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
}

/** 현재 페이지만 출력 */
export function printSheet(sheetId: string, title?: string): void {
  const sheet = document.getElementById(sheetId);
  if (!sheet) return;
  triggerPrint(buildPrintHtml(sheet.innerHTML, title));
}

/** 전체 페이지 출력 — sheetIds 순서대로 A4 한 장씩 출력 */
export function printAllSheets(sheetIds: string[], title?: string): void {
  const pagesHtml = sheetIds
    .map((id) => document.getElementById(id)?.innerHTML)
    .filter(Boolean)
    .map((html) => `<div class="print-page">${html}</div>`)
    .join('');

  if (!pagesHtml) return;
  triggerPrint(buildPrintHtml(pagesHtml, title));
}
