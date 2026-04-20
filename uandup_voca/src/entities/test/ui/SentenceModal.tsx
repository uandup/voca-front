import { useState } from 'react';
import { PrintActionBar } from './print/PrintActionBar';
import { PrintSheetHeader } from './print/PrintSheetHeader';
import { printAllSheets } from '../lib/print';

export interface ESRow {
  no: string;
  sentence: string;
}

const PAGE_SIZE = 20;
const ROW_HEIGHT_MM = 235 / PAGE_SIZE;
const ANSWER_COL_WIDTH = '110px';

interface TestESPrintModalProps {
  onClose: () => void;
  rows: ESRow[];
}

function SentenceSheet({
  id,
  pageRows,
  hidden,
}: {
  id: string;
  pageRows: ESRow[];
  hidden?: boolean;
}) {
  return (
    <main
      id={id}
      className="bg-white border border-black shadow-2xl flex flex-col"
      style={{
        width: '210mm',
        height: '297mm',
        padding: '10mm 10mm',
        ...(hidden ? { position: 'absolute', left: '-9999px', top: 0, visibility: 'hidden' } : {}),
      }}
    >
      <PrintSheetHeader />
      <section style={{ overflow: 'hidden' }}>
        <table
          className="w-full"
          style={{
            borderCollapse: 'collapse',
            height: `${pageRows.length * ROW_HEIGHT_MM}mm`,
            tableLayout: 'fixed',
          }}
        >
          <colgroup>
            <col style={{ width: '44px' }} />
            <col />
            <col style={{ width: ANSWER_COL_WIDTH }} />
          </colgroup>
          <thead>
            <tr>
              {['No', 'Example Sentence', 'Answer'].map((col, i) => (
                <th
                  key={col}
                  className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                  style={{
                    border: '1.5pt solid black',
                    padding: '4px 12px',
                    textAlign: i === 1 ? 'left' : 'center',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map(({ no: rowNo, sentence }) => {
              const parts = sentence.split('___');
              return (
                <tr key={rowNo} style={{ height: `${ROW_HEIGHT_MM}mm` }}>
                  <td
                    className="text-center text-sm font-bold"
                    style={{ border: '1.5pt solid black', padding: '4px 12px' }}
                  >
                    {rowNo}
                  </td>
                  <td
                    className="text-xs"
                    style={{ border: '1.5pt solid black', padding: '4px 12px' }}
                  >
                    {parts[0]}
                    {sentence && (
                      <span
                        style={{
                          display: 'inline-block',
                          minWidth: '100px',
                          borderBottom: '1px solid black',
                          margin: '0 2px',
                          verticalAlign: 'baseline',
                        }}
                      />
                    )}
                    {parts[1]}
                  </td>
                  <td style={{ border: '1.5pt solid black', padding: '4px 12px' }} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export function SentenceModal({ onClose, rows }: TestESPrintModalProps) {
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const [page, setPage] = useState(1);

  const allPageIds = Array.from({ length: totalPages }, (_, i) => `es-print-sheet-${i + 1}`);
  const handlePrint = () => printAllSheets(allPageIds);

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
      />

      <div className="mt-20" onClick={(e) => e.stopPropagation()}>
        <SentenceSheet
          id={`es-print-sheet-${page}`}
          pageRows={rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
        />
      </div>

      {allPageIds
        .filter((_, i) => i + 1 !== page)
        .map((id) => {
          const p = parseInt(id.split('-').pop()!);
          return (
            <SentenceSheet
              key={id}
              id={id}
              pageRows={rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE)}
              hidden
            />
          );
        })}
    </div>
  );
}
