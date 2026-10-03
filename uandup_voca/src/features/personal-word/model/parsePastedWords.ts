/**
 * 클립보드 텍스트 → 2차원 셀 배열.
 *
 * 엑셀·구글시트에서 Ctrl+C하면 클립보드 text/plain에 **TSV**가 담긴다 — 행은 개행, 셀은 탭.
 * 셀 경계가 탭이라 단어나 뜻 안의 공백·쉼표가 쪼개지지 않는다("유창한, 웅변적인"이 한 셀로 온다).
 * 공백이나 쉼표를 구분자로 추측하는 방식은 이 구분이 불가능해서 쓰지 않는다.
 *
 * 따옴표 처리: 셀에 탭·개행·따옴표가 들어가면 엑셀이 그 셀을 "..."로 감싸고 내부 "를 ""로
 * 이스케이프한다. 그래서 단순 split('\t')으로는 셀 안의 탭에서 잘못 끊긴다 → 상태 기계로 읽는다.
 *
 * 도메인(단어/뜻)을 모르게 둔다 — 2열을 넘는 셀을 버리는 것은 호출부의 책임이다.
 */
export function parsePastedGrid(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        // "" → 리터럴 " 한 개. 그 외의 "는 인용 구간의 끝.
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cell += ch;
      i += 1;
      continue;
    }

    // 따옴표는 셀 맨 앞에서만 인용 구간을 연다 — 중간의 "는 평범한 문자다.
    if (ch === '"' && cell === '') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (ch === '\t') {
      row.push(cell);
      cell = '';
      i += 1;
      continue;
    }

    if (ch === '\n' || ch === '\r') {
      row.push(cell);
      cell = '';
      rows.push(row);
      row = [];
      // \r\n(엑셀·윈도우)은 한 번만 끊는다.
      i += ch === '\r' && text[i + 1] === '\n' ? 2 : 1;
      continue;
    }

    cell += ch;
    i += 1;
  }

  // 마지막 셀 flush. 입력이 개행으로 끝났으면 cell도 row도 비어 있어 빈 행이 생기지 않는다.
  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}
