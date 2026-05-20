import { useState } from 'react';
import { PrintActionBar } from './PrintActionBar';
import { PrintSheetHeader } from './PrintSheetHeader';
import { printAllSheets } from '../lib/print';

export interface ESRow {
  no: string;
  sentence: string;
  answer: string;
}

const PAGE_SIZE = 20;
const ROW_HEIGHT_MM = 235 / PAGE_SIZE;
const ANSWER_COL_WIDTH = '110px';

interface TestESPrintModalProps {
  onClose: () => void;
  rows: ESRow[];
  studentName?: string;
  studentEnglishName?: string;
}

function SentenceSheet({
  id,
  pageRows,
  showAnswer,
  studentName,
  studentEnglishName,
  hidden,
}: {
  id: string;
  pageRows: ESRow[];
  // preview(화면): true → 정답 단어를 인라인으로 채워 보여줌.
  // print(인쇄): false → 빈 밑줄만 표시.
  showAnswer: boolean;
  studentName?: string;
  studentEnglishName?: string;
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
      <PrintSheetHeader name={studentName} englishName={studentEnglishName} />
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
            {pageRows.map(({ no: rowNo, sentence, answer }) => {
              const parts = sentence.split('______');
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
                    {sentence &&
                      (showAnswer ? (
                        <span
                          style={{
                            display: 'inline-block',
                            minWidth: '100px',
                            borderBottom: '1px solid black',
                            margin: '0 2px',
                            padding: '0 4px',
                            textAlign: 'center',
                            fontWeight: 600,
                            color: '#1d4ed8',
                            verticalAlign: 'baseline',
                          }}
                        >
                          {answer}
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-block',
                            minWidth: '100px',
                            borderBottom: '1px solid black',
                            margin: '0 2px',
                            verticalAlign: 'baseline',
                          }}
                        />
                      ))}
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

export function SentenceModal({
  onClose,
  rows,
  studentName,
  studentEnglishName,
}: TestESPrintModalProps) {
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const [page, setPage] = useState(1);

  // 화면 preview(정답 채워서 표시)와 실제 인쇄용(빈칸)을 별도 ID로 분리해야
  // 인쇄 시 preview 시트가 같이 출력되지 않는다. WordTestModal과 동일 패턴.
  const printPageIds = Array.from({ length: totalPages }, (_, i) => `es-print-sheet-${i + 1}`);
  const handlePrint = () => printAllSheets(printPageIds);

  const pageRowsAt = (p: number) => rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);

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

      {/* Preview — 화면 표시용 (정답 채움). 인쇄에서는 제외. */}
      <div className="mt-20" onClick={(e) => e.stopPropagation()}>
        <SentenceSheet
          id={`es-preview-sheet-${page}`}
          pageRows={pageRowsAt(page)}
          showAnswer
          studentName={studentName}
          studentEnglishName={studentEnglishName}
        />
      </div>

      {/* Print — 화면 밖 hidden sheets (전 페이지, 빈칸). printAllSheets 대상. */}
      {printPageIds.map((id, i) => (
        <SentenceSheet
          key={id}
          id={id}
          pageRows={pageRowsAt(i + 1)}
          showAnswer={false}
          studentName={studentName}
          studentEnglishName={studentEnglishName}
          hidden
        />
      ))}
    </div>
  );
}
