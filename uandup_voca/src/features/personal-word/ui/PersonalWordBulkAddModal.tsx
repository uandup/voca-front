import { useState, type ClipboardEvent } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { usePersonalWordActions } from '../model/usePersonalWordActions';
import { parsePastedGrid } from '../model/parsePastedWords';

interface GridRow {
  word: string;
  koreanMeaning: string;
}

interface PersonalWordBulkAddModalProps {
  studentId: number;
  personalWordSetId: number;
  onClose: () => void;
}

// 서버 상한과 같은 값 — 초과분은 붙여넣기 시점에 잘라 서버 400을 미리 막는다.
const MAX_WORDS = 500;
const INITIAL_ROWS = 5;

const EMPTY_ROW: GridRow = { word: '', koreanMeaning: '' };

function makeEmptyRows(count: number): GridRow[] {
  return Array.from({ length: count }, () => ({ ...EMPTY_ROW }));
}

function isBlank(row: GridRow): boolean {
  return row.word.trim() === '' && row.koreanMeaning.trim() === '';
}

// 한쪽만 채운 행 — 서버가 전부 거부하므로 저장 전에 표에서 잡는다.
function isIncomplete(row: GridRow): boolean {
  return !isBlank(row) && (row.word.trim() === '' || row.koreanMeaning.trim() === '');
}

/**
 * 붙여넣은 격자를 (startRow, startCol)을 좌상단 기준점으로 덮어쓴다.
 * 행이 부족하면 늘리고, 2열을 넘는 셀은 버린다(표가 2열뿐이다).
 */
function applyPaste(
  rows: GridRow[],
  grid: string[][],
  startRow: number,
  startCol: number,
): GridRow[] {
  const next = rows.map((r) => ({ ...r }));

  grid.forEach((cells, r) => {
    const targetRow = startRow + r;
    if (targetRow >= MAX_WORDS) return;
    while (next.length <= targetRow) next.push({ ...EMPTY_ROW });

    cells.forEach((value, c) => {
      const targetCol = startCol + c;
      if (targetCol === 0) next[targetRow].word = value;
      else if (targetCol === 1) next[targetRow].koreanMeaning = value;
    });
  });

  return next.slice(0, MAX_WORDS);
}

/**
 * 단어를 한 번에 여러 개 등록하는 모달.
 *
 * 엑셀에서 두 열(단어·뜻)을 복사해 표에 그대로 붙여넣는 방식이다. textarea에 붙여넣고
 * 구분자를 추측하는 방식을 쓰지 않는 이유: 단어와 뜻 양쪽에 공백이 들어갈 수 있어
 * "eloquent 유창한, 웅변적인"을 어디서 끊을지 결정할 수 없다. 클립보드 TSV는 셀 경계가
 * 탭이라 그 모호함이 없고, 표는 저장 전에 눈으로 확인·수정할 수 있다.
 */
export function PersonalWordBulkAddModal({
  studentId,
  personalWordSetId,
  onClose,
}: PersonalWordBulkAddModalProps) {
  const { createMany } = usePersonalWordActions({ studentId, personalWordSetId });

  const [rows, setRows] = useState<GridRow[]>(() => makeEmptyRows(INITIAL_ROWS));
  const [truncated, setTruncated] = useState(false);

  function updateCell(index: number, key: keyof GridRow, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) {
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;

    const grid = parsePastedGrid(text);
    // 셀 하나만 복사한 경우는 가로채지 않는다 — 기본 붙여넣기가 커서 위치·부분 선택 교체를 더 잘 처리한다.
    if (grid.length === 1 && grid[0].length === 1) return;

    e.preventDefault();
    const requested = rowIndex + grid.length;
    setTruncated(requested > MAX_WORDS);
    setRows((prev) => applyPaste(prev, grid, rowIndex, colIndex));
  }

  function addRow() {
    setRows((prev) => (prev.length >= MAX_WORDS ? prev : [...prev, { ...EMPTY_ROW }]));
  }

  function removeRow(index: number) {
    // 표가 완전히 비면 붙여넣을 대상이 없어지므로 최소 1행은 남긴다.
    setRows((prev) =>
      prev.length <= 1 ? [{ ...EMPTY_ROW }] : prev.filter((_, i) => i !== index),
    );
  }

  const readyRows = rows.filter((r) => !isBlank(r) && !isIncomplete(r));
  const incompleteCount = rows.filter(isIncomplete).length;
  const canSave = readyRows.length > 0 && incompleteCount === 0 && !createMany.isPending;

  function handleSave() {
    if (!canSave) return;
    createMany.mutate(readyRows, { onSuccess: onClose });
  }

  return (
    // 붙여넣은 내용을 실수로 날리지 않도록 백드롭 클릭으로 닫히지 않게 한다.
    <Modal onClose={onClose} closeOnBackdrop={false}>
      <div className="bg-white w-full max-w-200 rounded-3xl shadow-[0px_24px_64px_rgba(0,27,95,0.12)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-10 pt-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <h2 className="font-headline text-[28px] font-extrabold text-primary leading-tight">
              Add Words
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Copy two columns from Excel and paste them into the table below, or type directly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="px-10 overflow-y-auto flex-1">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="w-10 pb-2 text-[11px] font-bold text-on-surface-variant/60 text-center">
                  #
                </th>
                <th className="pb-2 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pl-3">
                  Word
                </th>
                <th className="pb-2 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pl-3">
                  Korean Meaning
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const bad = isIncomplete(row);
                return (
                  <tr key={index}>
                    <td className="text-[11px] text-on-surface-variant/40 text-center align-middle">
                      {index + 1}
                    </td>
                    <td className="py-1 pl-3">
                      <input
                        type="text"
                        value={row.word}
                        onChange={(e) => updateCell(index, 'word', e.target.value)}
                        onPaste={(e) => handlePaste(e, index, 0)}
                        placeholder="eloquent"
                        className={`w-full text-sm bg-surface-container-low border rounded-lg px-3 py-2.5 outline-none transition-all font-headline font-bold text-primary placeholder:text-on-surface-variant/30 placeholder:font-normal focus:ring-2 focus:ring-primary/20 ${
                          bad && row.word.trim() === ''
                            ? 'border-error/60'
                            : 'border-transparent'
                        }`}
                      />
                    </td>
                    <td className="py-1 pl-3">
                      <input
                        type="text"
                        value={row.koreanMeaning}
                        onChange={(e) => updateCell(index, 'koreanMeaning', e.target.value)}
                        onPaste={(e) => handlePaste(e, index, 1)}
                        placeholder="유창한, 웅변적인"
                        className={`w-full text-sm bg-surface-container-low border rounded-lg px-3 py-2.5 outline-none transition-all text-on-surface-variant placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20 ${
                          bad && row.koreanMeaning.trim() === ''
                            ? 'border-error/60'
                            : 'border-transparent'
                        }`}
                      />
                    </td>
                    <td className="text-center align-middle">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        aria-label={`Remove row ${index + 1}`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant/40 hover:text-error hover:bg-error/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            type="button"
            onClick={addRow}
            className="mt-2 flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add row
          </button>
        </div>

        <div className="px-10 py-6 shrink-0 border-t border-outline-variant/20 flex items-center justify-between gap-6">
          <div className="text-xs min-w-0">
            {incompleteCount > 0 ? (
              <p className="text-error font-semibold">
                {incompleteCount} row(s) are missing a word or a meaning. Fill or remove them to
                save.
              </p>
            ) : (
              <p className="text-on-surface-variant">
                {readyRows.length} {readyRows.length === 1 ? 'word' : 'words'} ready
              </p>
            )}
            {truncated && (
              <p className="text-on-surface-variant/70 mt-1">
                Only the first {MAX_WORDS} rows were kept.
              </p>
            )}
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="text-[15px] font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="px-10 py-4 bg-primary text-white text-[15px] font-bold rounded-xl shadow-[0px_8px_24px_rgba(0,27,95,0.2)] hover:bg-primary-container transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {createMany.isPending ? 'Saving...' : 'Save Words'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
