import { useState } from "react";
import { PrintActionBar, type ColumnToggle } from "@/shared/test-print/ui/PrintActionBar";
import { PrintSheetHeader } from "@/shared/test-print/ui/PrintSheetHeader";
import { printAllSheets } from "@/shared/test-print/lib/print";
import type { VocabItem } from "@/shared/test-print/lib/mockData";

const PAGE_SIZE = 25;

interface TestWMPrintModalProps {
  onClose: () => void;
  no?: string;
  rows: VocabItem[];
}

function WMSheet({
  id,
  no,
  pageRows,
  page,
  totalPages,
  showWord,
  showKor,
  showEng,
  hidden,
}: {
  id: string;
  no?: string;
  pageRows: VocabItem[];
  page: number;
  totalPages: number;
  showWord: boolean;
  showKor: boolean;
  showEng: boolean;
  hidden?: boolean;
}) {
  return (
    <main
      id={id}
      className="bg-white border border-black shadow-2xl flex flex-col"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "10mm 20mm",
        ...(hidden ? { position: "absolute", left: "-9999px", top: 0, visibility: "hidden" } : {}),
      }}
    >
      <PrintSheetHeader no={no} />
      <section className="grow" style={{ overflow: "hidden" }}>
        <table className="w-full" style={{ borderCollapse: "collapse", height: "100%", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "44px" }} />
            <col style={{ width: "22%" }} />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                style={{ border: "1.5pt solid black", padding: "4px 12px", textAlign: "center" }}>No</th>
              <th className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                style={{ border: "1.5pt solid black", padding: "4px 12px" }}>Word</th>
              <th className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                style={{ border: "1.5pt solid black", padding: "4px 12px" }}>Korean Meaning</th>
              <th className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                style={{ border: "1.5pt solid black", padding: "4px 12px" }}>English Meaning</th>
            </tr>
          </thead>
          <tbody style={{ height: "100%" }}>
            {pageRows.map(({ word, korMeaning, engMeaning }, idx) => (
              <tr key={idx} style={{ height: `${100 / PAGE_SIZE}%` }}>
                <td className="text-center text-sm font-bold" style={{ border: "1.5pt solid black", padding: "4px 12px" }}>
                  {String((page - 1) * PAGE_SIZE + idx + 1).padStart(2, "0")}
                </td>
                <td className="text-xs font-bold uppercase" style={{ border: "1.5pt solid black", padding: "4px 12px" }}>
                  {showWord ? word : ""}
                </td>
                <td className="text-xs" style={{ border: "1.5pt solid black", padding: "4px 12px" }}>
                  {showKor ? korMeaning : ""}
                </td>
                <td className="text-xs" style={{ border: "1.5pt solid black", padding: "4px 12px" }}>
                  {showEng ? engMeaning : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <footer className="mt-8 py-6 border-t border-black items-center text-[10px] font-bold tracking-widest uppercase">
        <div>Page {String(page).padStart(2, "0")} of {String(totalPages).padStart(2, "0")}</div>
      </footer>
    </main>
  );
}

export function TestWMPrintModal({ onClose, no, rows }: TestWMPrintModalProps) {
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState<ColumnToggle[]>([
    { key: "word",    label: "Word",             visible: true  },
    { key: "kor",     label: "Korean Meaning",   visible: false },
    { key: "eng",     label: "English Meaning",  visible: false },
  ]);

  const isVisible = (key: string) => columns.find((c) => c.key === key)?.visible ?? false;
  const handleColumnToggle = (key: string) =>
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)));

  const allPageIds = Array.from({ length: totalPages }, (_, i) => `wm-print-sheet-${i + 1}`);
  const handlePrint = () => printAllSheets(allPageIds);

  const sheetProps = (p: number) => ({
    no,
    pageRows: rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE),
    page: p,
    totalPages,
    showWord: isVisible("word"),
    showKor: isVisible("kor"),
    showEng: isVisible("eng"),
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <PrintActionBar
        onClose={onClose}
        onPrint={handlePrint}
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="mt-20" onClick={(e) => e.stopPropagation()}>
        <WMSheet id={`wm-print-sheet-${page}`} {...sheetProps(page)} />
      </div>

      {allPageIds
        .filter((_, i) => i + 1 !== page)
        .map((id) => {
          const p = parseInt(id.split("-").pop()!);
          return <WMSheet key={id} id={id} {...sheetProps(p)} hidden />;
        })}
    </div>
  );
}
