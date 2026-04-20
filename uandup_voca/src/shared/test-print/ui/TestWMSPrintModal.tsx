import { useState } from 'react';
import { PrintActionBar, type ColumnToggle } from '@/shared/test-print/ui/PrintActionBar';
import { PrintSheetHeader } from '@/shared/test-print/ui/PrintSheetHeader';
import { printAllSheets } from '@/shared/test-print/lib/print';
import type { VocabItem } from '@/shared/test-print/lib/mockData';

const PAGE_SIZE = 20;
// A4(297mm) - 상하패딩(20mm) - PrintSheetHeader(25mm) - thead(7mm) = 245mm
const ROW_HEIGHT_MM = 235 / PAGE_SIZE;

interface TestWMSPrintModalProps {
  onClose: () => void;
  no?: string;
  rows: VocabItem[];
}

function MeaningCell({
  korMeaning,
  engMeaning,
  showKor,
  showEng,
}: {
  korMeaning: string;
  engMeaning: string;
  showKor: boolean;
  showEng: boolean;
}) {
  return (
    <td className="text-xs" style={{ border: '1.5pt solid black', padding: '4px 12px' }}>
      {showKor && showEng ? (
        <span style={{ fontSize: '0.6rem' }}>{`${korMeaning}, ${engMeaning}`}</span>
      ) : showKor ? (
        korMeaning
      ) : showEng ? (
        engMeaning
      ) : (
        ''
      )}
    </td>
  );
}

function WMSSheet({
  id,
  no,
  pageRows,
  page,
  showWord,
  showKor,
  showEng,
  showSynonym,
  hidden,
}: {
  id: string;
  no?: string;
  pageRows: VocabItem[];
  page: number;
  showWord: boolean;
  showKor: boolean;
  showEng: boolean;
  showSynonym: boolean;
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
        ...(hidden
          ? {
              position: 'absolute',
              left: '-9999px',
              top: 0,
              visibility: 'hidden',
            }
          : {}),
      }}
    >
      <PrintSheetHeader no={no} />
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
            <col style={{ width: '20%' }} />
            <col />
            {showSynonym && <col style={{ width: '20%' }} />}
          </colgroup>
          <thead>
            <tr>
              <th
                className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                style={{
                  border: '1.5pt solid black',
                  padding: '4px 12px',
                  textAlign: 'center',
                }}
              >
                No
              </th>
              <th
                className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                style={{ border: '1.5pt solid black', padding: '4px 12px' }}
              >
                Word
              </th>
              <th
                className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                style={{ border: '1.5pt solid black', padding: '4px 12px' }}
              >
                Definition / Meaning
              </th>
              {showSynonym && (
                <th
                  className="text-left text-xs font-extrabold uppercase tracking-[0.05em] bg-[#f2f2f2]"
                  style={{ border: '1.5pt solid black', padding: '4px 12px' }}
                >
                  Synonym
                </th>
              )}
            </tr>
          </thead>
          <tbody style={{ height: '100%' }}>
            {pageRows.map(({ word, korMeaning, engMeaning }, idx) => (
              <tr key={idx} style={{ height: `${ROW_HEIGHT_MM}mm` }}>
                <td
                  className="text-center text-sm font-bold"
                  style={{ border: '1.5pt solid black', padding: '4px 12px' }}
                >
                  {String((page - 1) * PAGE_SIZE + idx + 1).padStart(2, '0')}
                </td>
                <td
                  className="text-xs"
                  style={{ border: '1.5pt solid black', padding: '4px 12px' }}
                >
                  {showWord ? word : ''}
                </td>
                <MeaningCell
                  korMeaning={korMeaning}
                  engMeaning={engMeaning}
                  showKor={showKor}
                  showEng={showEng}
                />
                {showSynonym && (
                  <td
                    className="text-xs"
                    style={{ border: '1.5pt solid black', padding: '4px 12px' }}
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export function TestWMSPrintModal({ onClose, no, rows }: TestWMSPrintModalProps) {
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState<ColumnToggle[]>([
    { key: 'word', label: 'Word', visible: true },
    { key: 'kor', label: 'Korean Meaning', visible: false },
    { key: 'eng', label: 'English Meaning', visible: false },
    { key: 'synonym', label: 'Synonym 컬럼', visible: true },
  ]);

  const isVisible = (key: string) => columns.find((c) => c.key === key)?.visible ?? false;
  const handleColumnToggle = (key: string) =>
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)));

  const allPageIds = Array.from({ length: totalPages }, (_, i) => `wms-print-sheet-${i + 1}`);
  const handlePrint = () => printAllSheets(allPageIds);

  const sheetProps = (p: number) => ({
    no,
    pageRows: rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE),
    page: p,
    showWord: isVisible('word'),
    showKor: isVisible('kor'),
    showEng: isVisible('eng'),
    showSynonym: isVisible('synonym'),
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
        <WMSSheet id={`wms-print-sheet-${page}`} {...sheetProps(page)} />
      </div>

      {allPageIds
        .filter((_, i) => i + 1 !== page)
        .map((id) => {
          const p = parseInt(id.split('-').pop()!);
          return <WMSSheet key={id} id={id} {...sheetProps(p)} hidden />;
        })}
    </div>
  );
}
