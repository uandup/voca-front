import { useRef, useState } from 'react';
import { GradeActionBar } from './GradeActionBar';
import { PrintSheetHeader } from './PrintSheetHeader';
import type { ESRow } from './SentenceModal';

const PAGE_SIZE = 20;
const ROW_HEIGHT_MM = 235 / PAGE_SIZE;
const ANSWER_COL_WIDTH = '110px';

interface SentenceGradingModalProps {
  onClose: () => void;
  onGrade?: () => void;
  rows: ESRow[];
}

function SentenceGradingSheet({
  id,
  pageRows,
  checked,
  onToggle,
  hidden,
}: {
  id: string;
  pageRows: ESRow[];
  checked: boolean[];
  onToggle: (idx: number) => void;
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
      <section className="grow" style={{ overflow: 'hidden' }}>
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
            <col style={{ width: '48px' }} />
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
              <th
                className="text-xs font-extrabold uppercase tracking-[0.05em] bg-[#fff3cd]"
                style={{ border: '1.5pt solid black', padding: '4px 6px', textAlign: 'center' }}
              >
                ✓
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(({ no: rowNo, sentence, answer }, idx) => {
              const parts = sentence.split('___');
              return (
                <tr
                  key={rowNo}
                  style={{
                    height: `${ROW_HEIGHT_MM}mm`,
                    backgroundColor: checked[idx] ? '#fff5f5' : undefined,
                  }}
                >
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
                  <td
                    style={{ border: '1.5pt solid black', padding: '4px 12px', fontSize: '11px' }}
                  >
                    {answer}
                  </td>
                  <td
                    style={{ border: '1.5pt solid black', padding: '4px 6px', textAlign: 'center' }}
                  >
                    <input
                      type="checkbox"
                      checked={checked[idx] ?? false}
                      onChange={() => onToggle(idx)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export function SentenceGradingModal({ onClose, onGrade, rows }: SentenceGradingModalProps) {
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [checkedByPage, setCheckedByPage] = useState<boolean[][]>(() =>
    Array.from({ length: totalPages }, (_, i) =>
      Array(Math.min(PAGE_SIZE, rows.length - i * PAGE_SIZE)).fill(false),
    ),
  );

  const handleToggle = (pageIdx: number, rowIdx: number) => {
    setCheckedByPage((prev) =>
      prev.map((pageChecks, i) =>
        i === pageIdx ? pageChecks.map((v, j) => (j === rowIdx ? !v : v)) : pageChecks,
      ),
    );
  };

  const allPageIds = Array.from(
    { length: totalPages },
    (_, i) => `sentence-grading-sheet-${i + 1}`,
  );

  const sheetProps = (p: number) => ({
    pageRows: rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE),
    checked: checkedByPage[p - 1] ?? [],
    onToggle: (idx: number) => handleToggle(p - 1, idx),
  });

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <GradeActionBar
        onClose={onClose}
        onGrade={onGrade ?? (() => {})}
        page={page}
        totalPages={totalPages}
        onPrev={() => {
          setPage((p) => Math.max(1, p - 1));
          scrollRef.current?.scrollTo({ top: 0 });
        }}
        onNext={() => {
          setPage((p) => Math.min(totalPages, p + 1));
          scrollRef.current?.scrollTo({ top: 0 });
        }}
      />

      <div className="flex flex-col items-center gap-4 mt-20" onClick={(e) => e.stopPropagation()}>
        <SentenceGradingSheet id={`sentence-grading-sheet-${page}`} {...sheetProps(page)} />
      </div>

      {allPageIds
        .filter((_, i) => i + 1 !== page)
        .map((id) => {
          const p = parseInt(id.split('-').pop()!);
          return <SentenceGradingSheet key={id} id={id} {...sheetProps(p)} hidden />;
        })}
    </div>
  );
}
