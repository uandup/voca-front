import { useLayoutEffect, useRef, useState } from 'react';
import { PrintActionBar } from './PrintActionBar';
import { PrintSheetHeader } from './PrintSheetHeader';
import { printAllSheetsFlowing } from '../lib/print';
import type { ESRow } from '@/entities/test';

// Preview는 실제 출력 미리보기다 — 화면에서 보이는 페이지 구성이 브라우저 출력과 동일해야 한다.
// PAGE_SIZE 고정 분할 대신, 실제 row 높이를 측정해 A4 한 페이지에 들어갈 row를 동적으로 계산한다.
//
// 흐름:
//   1. hidden 측정 시트에 전체 row를 자연 높이로 렌더링
//   2. useLayoutEffect에서 각 row 높이를 측정 → 페이지 할당 계산
//   3. 계산 완료 후 paginated preview + 인쇄용 hidden 시트 렌더링
//
// 인쇄: printAllSheetsFlowing → tr break-inside: avoid → row 분할 없이 자연 A4 페이지 분할

const ANSWER_COL_WIDTH = '110px';
const MEASURE_SHEET_ID = 'es-measure-sheet';

// A4 가용 높이는 브라우저 zoom에 따라 달라지므로 런타임에 측정한다.
// main 요소의 padding: 10mm를 computed style로 읽어 1mm → CSS px 환산비를 도출.
// (하드코딩 3.7795px/mm는 zoom != 100% 시 오차 발생 → 과도 할당 → print 페이지 수 불일치)

interface SentenceSheetProps {
  id: string;
  rows: ESRow[];
  showAnswer: boolean;
  studentName?: string;
  studentEnglishName?: string;
  hidden?: boolean;
  // 측정 시트 전용 — tbody ref를 통해 row 높이를 읽는다.
  tbodyRef?: React.RefObject<HTMLTableSectionElement | null>;
}

function SentenceSheet({
  id,
  rows,
  showAnswer,
  studentName,
  studentEnglishName,
  hidden,
  tbodyRef,
}: SentenceSheetProps) {
  return (
    <main
      id={id}
      className="bg-white border border-black shadow-2xl flex flex-col"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '10mm 10mm',
        ...(hidden ? { position: 'absolute', left: '-9999px', top: 0, visibility: 'hidden' } : {}),
      }}
    >
      <PrintSheetHeader name={studentName} englishName={studentEnglishName} />
      <section className="grow" style={{ overflow: 'visible' }}>
        <table
          className="w-full"
          style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}
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
          <tbody ref={tbodyRef}>
            {rows.map(({ no: rowNo, sentence, answer }) => {
              const parts = sentence.split('______');
              return (
                <tr key={rowNo}>
                  <td
                    className="text-center text-sm font-bold"
                    style={{ border: '1.5pt solid black', padding: '8px 12px' }}
                  >
                    {rowNo}
                  </td>
                  <td
                    className="text-xs"
                    style={{ border: '1.5pt solid black', padding: '8px 12px' }}
                  >
                    {/* 빈칸은 밑줄로만 표시. 정답은 Answer 컬럼에 표시한다. */}
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
                  {/* preview: 정답 표시(파란색). print: 학생이 직접 기입하므로 비워둠. */}
                  <td
                    style={{
                      border: '1.5pt solid black',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: showAnswer ? 600 : undefined,
                      color: showAnswer ? '#1d4ed8' : undefined,
                    }}
                  >
                    {showAnswer ? answer : null}
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

interface TestESPrintModalProps {
  onClose: () => void;
  rows: ESRow[];
  studentName?: string;
  studentEnglishName?: string;
}

export function SentenceModal({ onClose, rows, studentName, studentEnglishName }: TestESPrintModalProps) {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const [pages, setPages] = useState<ESRow[][]>([]);
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 측정 시트의 row 높이를 읽어 A4 페이지 할당을 계산한다.
  // rows가 바뀔 때마다 재계산.
  useLayoutEffect(() => {
    const tbody = tbodyRef.current;
    if (!tbody) return;

    const mainEl = tbody.closest('main');
    if (!mainEl) return;

    // zoom-aware mm→px 환산: main의 padding(10mm)을 computed style로 측정
    const mainStyle = window.getComputedStyle(mainEl);
    const paddingTopPx = parseFloat(mainStyle.paddingTop); // 10mm in zoom-adjusted CSS px
    const mmPx = paddingTopPx / 10; // 1mm in CSS px (zoom-aware)
    const a4ContentPx = (297 - 10 - 10) * mmPx; // 277mm in CSS px

    // A4 한 장에서 row들이 차지할 수 있는 높이 = printable 높이 - 헤더 - 헤더 margin - thead
    // header의 mb-6(24px)은 getBoundingClientRect().height에 포함되지 않으므로 별도 측정
    const headerEl = mainEl.querySelector('header');
    const theadEl = mainEl.querySelector('thead');
    const headerH = headerEl?.getBoundingClientRect().height ?? 0;
    const headerMarginBottom = headerEl
      ? parseFloat(window.getComputedStyle(headerEl).marginBottom)
      : 0;
    const theadH = theadEl?.getBoundingClientRect().height ?? 0;
    const availableH = a4ContentPx - headerH - headerMarginBottom - theadH;

    // 각 row의 실제 렌더링 높이 측정
    const rowEls = Array.from(tbody.querySelectorAll('tr'));
    const rowHeights = rowEls.map((el) => el.getBoundingClientRect().height);

    // 높이 기준으로 row를 페이지에 할당 (bin-packing: first-fit)
    const pageList: ESRow[][] = [];
    let currentPage: ESRow[] = [];
    let currentH = 0;

    rows.forEach((row, i) => {
      const h = rowHeights[i] ?? 24;
      if (currentH + h > availableH && currentPage.length > 0) {
        pageList.push(currentPage);
        currentPage = [row];
        currentH = h;
      } else {
        currentPage.push(row);
        currentH += h;
      }
    });

    if (currentPage.length > 0) pageList.push(currentPage);
    // DOM 측정 후 파생 state를 동기적으로 설정 — useLayoutEffect 내 setState는 의도적.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPages(pageList);
    setPage(1);
  }, [rows]);

  const totalPages = pages.length;
  // 측정 완료 전에는 전체 row를 fallback으로 보여준다.
  const currentPageRows = pages.length > 0 ? (pages[page - 1] ?? []) : rows;
  const printPageIds = pages.map((_, i) => `es-print-page-${i + 1}`);
  // 측정 전에는 측정 시트 자체를 출력에 사용.
  const handlePrint = () =>
    printAllSheetsFlowing(printPageIds.length > 0 ? printPageIds : [MEASURE_SHEET_ID]);

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
        totalPages={totalPages > 0 ? totalPages : undefined}
        onPrev={() => {
          setPage((p) => Math.max(1, p - 1));
          scrollRef.current?.scrollTo({ top: 0 });
        }}
        onNext={() => {
          setPage((p) => Math.min(totalPages, p + 1));
          scrollRef.current?.scrollTo({ top: 0 });
        }}
      />

      {/* Preview — 계산된 페이지 기준으로 현재 페이지 표시. */}
      <div className="mt-20" onClick={(e) => e.stopPropagation()}>
        <SentenceSheet
          id={`es-preview-sheet-${page}`}
          rows={currentPageRows}
          showAnswer
          studentName={studentName}
          studentEnglishName={studentEnglishName}
        />
      </div>

      {/* 측정 시트 — 전체 row를 자연 높이로 렌더링해 높이를 측정한다. 화면에서는 hidden. */}
      <SentenceSheet
        id={MEASURE_SHEET_ID}
        rows={rows}
        showAnswer={false}
        tbodyRef={tbodyRef}
        studentName={studentName}
        studentEnglishName={studentEnglishName}
        hidden
      />

      {/* 인쇄용 hidden 시트 — 계산된 페이지별로 1장씩. printAllSheetsFlowing 대상. */}
      {pages.map((pageRows, i) => (
        <SentenceSheet
          key={`es-print-page-${i + 1}`}
          id={`es-print-page-${i + 1}`}
          rows={pageRows}
          showAnswer={false}
          studentName={studentName}
          studentEnglishName={studentEnglishName}
          hidden
        />
      ))}
    </div>
  );
}
