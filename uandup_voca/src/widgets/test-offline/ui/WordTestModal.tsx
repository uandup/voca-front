import { useRef, useState } from 'react';
import { PrintActionBar } from './PrintActionBar';
import { PrintSheetHeader } from './PrintSheetHeader';
import { printAllSheets } from '../lib/print';
import type { WordTestItem as TestWord } from '@/entities/word';
import type { TestType } from '@/entities/test';

const PAGE_SIZE = 20;
// A4(297mm) - 상하패딩(20mm) - PrintSheetHeader(25mm) - thead(7mm) = 245mm
const ROW_HEIGHT_MM = 235 / PAGE_SIZE;

interface TestWMSPrintModalProps {
  onClose: () => void;
  rows: TestWord[];
  testType?: TestType;
  includeSynonyms?: boolean;
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

function WordSheet({
  id,
  pageRows,
  showWord,
  showKor,
  showEng,
  showSynonym,
  fillSynonym,
  hidden,
}: {
  id: string;
  pageRows: TestWord[];
  showWord: boolean;
  showKor: boolean;
  showEng: boolean;
  showSynonym: boolean;
  // 컬럼이 표시될 때 값을 채울지 여부 — preview는 true, print는 false (학생이 채움).
  fillSynonym: boolean;
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
            {pageRows.map(({ id, word, korMeaning, engMeaning, synonyms }, idx) => (
              <tr key={idx} style={{ height: `${ROW_HEIGHT_MM}mm` }}>
                <td
                  className="text-center text-sm font-bold"
                  style={{ border: '1.5pt solid black', padding: '4px 12px' }}
                >
                  {String(id).padStart(2, '0')}
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
                  >
                    {fillSynonym ? synonyms.join(', ') : ''}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export function WordTestModal({
  onClose,
  rows,
  testType = 'meaning-to-word',
  includeSynonyms = false,
}: TestWMSPrintModalProps) {
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Print: 학생이 채워야 하는 칸은 비워둠 (testType 기준).
  const printShowWord = testType === 'word-to-meaning';
  const printShowKor = testType === 'meaning-to-word';
  const printShowEng = testType === 'meaning-to-word';
  // Preview(화면): 교사가 한눈에 확인할 수 있도록 모든 칸을 채움.
  const previewShowWord = true;
  const previewShowKor = true;
  const previewShowEng = true;
  // Synonym 표시 여부는 화면/인쇄 모두 학생 설정을 따름.
  const showSynonym = includeSynonyms;

  const printPageIds = Array.from({ length: totalPages }, (_, i) => `wms-print-sheet-${i + 1}`);
  const handlePrint = () => printAllSheets(printPageIds);

  const pageRowsAt = (p: number) => rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <PrintActionBar
        onClose={onClose}
        onPrint={handlePrint}
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

      {/* Preview — 화면 표시용 (모든 칸 채움, synonym 컬럼이 표시되면 값도 채움) */}
      <div className="mt-20" onClick={(e) => e.stopPropagation()}>
        <WordSheet
          id={`wms-preview-sheet-${page}`}
          pageRows={pageRowsAt(page)}
          showWord={previewShowWord}
          showKor={previewShowKor}
          showEng={previewShowEng}
          showSynonym={showSynonym}
          fillSynonym
        />
      </div>

      {/* Print — 화면 밖 hidden sheets (testType 기준으로 학생용 빈칸 적용) */}
      {printPageIds.map((id, i) => (
        <WordSheet
          key={id}
          id={id}
          pageRows={pageRowsAt(i + 1)}
          showWord={printShowWord}
          showKor={printShowKor}
          showEng={printShowEng}
          showSynonym={showSynonym}
          fillSynonym={false}
          hidden
        />
      ))}
    </div>
  );
}
