import { useEffect, useRef, useState } from "react";
import { PrintActionBar } from "@/shared/test-print/ui/PrintActionBar";
import { PrintSheetHeader } from "@/shared/test-print/ui/PrintSheetHeader";
import { printSheet } from "@/shared/test-print/lib/print";

export interface ESRow {
  no: string;
  sentence: string;
}

interface TestESPrintModalProps {
  onClose: () => void;
  no?: string;
  rows: ESRow[];
}

export function TestESPrintModal({ onClose, no, rows }: TestESPrintModalProps) {
  const handlePrint = () => printSheet("es-print-sheet");
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const [rowHeight, setRowHeight] = useState<number | null>(null);
  const totalRows = rows.length;

  useEffect(() => {
    if (tbodyRef.current) {
      setRowHeight(tbodyRef.current.clientHeight / totalRows);
    }
  }, [totalRows]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <PrintActionBar onClose={onClose} onPrint={handlePrint} />

      {/* A4 Paper */}
      <main
        id="es-print-sheet"
        className="mt-20 bg-white border border-black shadow-2xl flex flex-col"
        style={{ width: "210mm", height: "297mm", padding: "10mm 20mm" }}
        onClick={(e) => e.stopPropagation()}
      >
        <PrintSheetHeader no={no} />

        <section className="grow" style={{ overflow: "hidden" }}>
          <table
            className="w-full"
            style={{
              borderCollapse: "collapse",
              height: "100%",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: "44px" }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                {["No", "Example Sentence"].map((col, i) => (
                  <th
                    key={col}
                    className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                    style={{
                      border: "1.5pt solid black",
                      padding: "4px 12px",
                      textAlign: i === 0 ? "center" : "left",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={tbodyRef} style={{ height: "100%" }}>
              {rows.map(({ no: rowNo, sentence }) => {
                const parts = sentence.split("___");
                return (
                  <tr key={rowNo} style={{ height: rowHeight ?? `${100 / totalRows}%` }}>
                    <td
                      className="text-center text-sm font-bold"
                      style={{ border: "1.5pt solid black", padding: "4px 12px" }}
                    >
                      {rowNo}
                    </td>
                    <td
                      className="text-xs"
                      style={{ border: "1.5pt solid black", padding: "4px 12px" }}
                    >
                      {parts[0]}
                      {sentence && (
                        <span
                          style={{
                            display: "inline-block",
                            minWidth: "100px",
                            borderBottom: "1px solid black",
                            margin: "0 2px",
                            verticalAlign: "baseline",
                          }}
                        />
                      )}
                      {parts[1]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <footer className="mt-8 py-6 border-t border-black items-center text-[10px] font-bold tracking-widest uppercase">
          <div>Page 01 of 01</div>
        </footer>
      </main>
    </div>
  );
}
