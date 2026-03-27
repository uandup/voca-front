function buildPrintHtml(sheetHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
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
    </style>
  </head>
  <body>${sheetHtml}</body>
</html>`;
}

export function printSheet(sheetId: string): void {
  const sheet = document.getElementById(sheetId);
  if (!sheet) return;

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:0;border:none;visibility:hidden;";
  iframe.srcdoc = buildPrintHtml(sheet.innerHTML);
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
}
