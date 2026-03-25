import { PrintActionBar } from "@/widgets/test-print/ui/PrintActionBar";
import { PrintSheetHeader } from "@/widgets/test-print/ui/PrintSheetHeader";
import { printSheet } from "@/widgets/test-print/lib/print";

interface TestWMPrintModalProps {
  onClose: () => void;
  no?: string;
}

const words = [
  "Eloquent",
  "Pragmatic",
  "Ambiguous",
  "Resilient",
  "Meticulous",
  "Inevitability",
  "Paradigm",
  "Vulnerable",
  "Hypothesis",
  "Conundrum",
  "Ephemeral",
  "Synthesis",
  "Ubiquitous",
  "Cognizant",
  "Benevolent",
];

const TOTAL_ROWS = 25;
const rows = Array.from({ length: TOTAL_ROWS }, (_, i) => ({
  no: String(i + 1).padStart(2, "0"),
  word: words[i] ?? "",
}));

export function TestWMPrintModal({ onClose, no }: TestWMPrintModalProps) {
  const handlePrint = () => printSheet("wm-print-sheet");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <PrintActionBar onClose={onClose} onPrint={handlePrint} />

      {/* A4 Paper */}
      <main
        id="wm-print-sheet"
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
              <col style={{ width: "44px" }} /> {/* No. */}
              <col style={{ width: "25%" }} /> {/* Word */}
              <col /> {/* Definition — 나머지 */}
            </colgroup>
            <thead>
              <tr>
                {["No", "Word", "Definition / Meaning"].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                    style={{
                      border: "1.5pt solid black",
                      padding: "4px 12px",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ height: "100%" }}>
              {rows.map(({ no, word }) => (
                <tr key={no} style={{ height: `${100 / TOTAL_ROWS}%` }}>
                  <td
                    className="text-center text-sm font-bold"
                    style={{
                      border: "1.5pt solid black",
                      padding: "4px 12px",
                      width: "4rem",
                    }}
                  >
                    {no}
                  </td>
                  <td
                    className="text-xs font-bold uppercase"
                    style={{
                      border: "1.5pt solid black",
                      padding: "4px 12px",
                      width: "220px",
                    }}
                  >
                    {word}
                  </td>
                  <td
                    className="text-xs"
                    style={{ border: "1.5pt solid black", padding: "4px 12px" }}
                  />
                </tr>
              ))}
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
