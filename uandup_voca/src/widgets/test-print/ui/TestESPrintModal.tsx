import { PrintActionBar } from "@/widgets/test-print/ui/PrintActionBar";
import { PrintSheetHeader } from "@/widgets/test-print/ui/PrintSheetHeader";
import { printSheet } from "@/widgets/test-print/lib/print";

interface TestESPrintModalProps {
  onClose: () => void;
  no?: string;
}

const sentences = [
  "The professor provided an ___ explanation of the complex chemical reaction.",
  "Her research was considered ___ by the academic committee because of its unique approach.",
  "The artifact remained remarkably ___ despite being buried for over two centuries.",
  "He was so ___ in his study of ancient linguistics that he forgot to eat dinner.",
  "The sudden ___ in market prices caused widespread concern among local investors.",
  "It is ___ that we finish the data collection before the rainy season begins.",
  "The diplomat's ___ tone helped de-escalate the tension during the negotiation.",
  "A small ___ in the foundation could compromise the entire structural integrity of the bridge.",
  "The author's latest novel is a ___ of various genres including mystery and historical fiction.",
  "After several hours of deliberation, the jury reached a ___ verdict.",
  "The new software update is designed to ___ the workflow for creative professionals.",
  "She handled the delicate situation with great ___ and professionalism.",
];

const TOTAL_ROWS = 15;
const rows = Array.from({ length: TOTAL_ROWS }, (_, i) => ({
  no: String(i + 1).padStart(2, "0"),
  sentence: sentences[i] ?? "",
}));

export function TestESPrintModal({ onClose, no }: TestESPrintModalProps) {
  const handlePrint = () => printSheet("es-print-sheet");

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
              <col style={{ width: "44px" }} /> {/* No. */}
              <col /> {/* Example Sentence */}
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
            <tbody style={{ height: "100%" }}>
              {rows.map(({ no, sentence }) => {
                const parts = sentence.split("___");
                return (
                  <tr key={no} style={{ height: `${100 / TOTAL_ROWS}%` }}>
                    <td
                      className="text-center text-sm font-bold"
                      style={{
                        border: "1.5pt solid black",
                        padding: "4px 12px",
                      }}
                    >
                      {no}
                    </td>
                    <td
                      className="text-xs"
                      style={{
                        border: "1.5pt solid black",
                        padding: "4px 12px",
                      }}
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
