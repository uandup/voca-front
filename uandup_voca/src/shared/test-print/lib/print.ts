function buildPrintHtml(sheetHtml: string, title = "VOCAB TEST"): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @page { size: A4; margin: 10mm 20mm; }
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

function triggerPrint(html: string): void {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:0;border:none;visibility:hidden;";
  iframe.srcdoc = html;
  document.body.appendChild(iframe);

  iframe.onload = () => {
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
    .join("");

  if (!pagesHtml) return;
  triggerPrint(buildPrintHtml(pagesHtml, title));
}
