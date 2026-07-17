// 큐 표시용 시각 포맷 헬퍼. shared/lib에 날짜 유틸이 없어 이 페이지 전용으로 둔다.

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

// "3 min ago"처럼 제출 후 경과 시간을 상대 표기. 선생님이 얼마나 오래 대기했는지 즉시 읽게 한다.
// 서버 시각 문자열이 비었거나 파싱 불가면 '-'를 반환한다.
export function formatRelativeTime(iso: string): string {
  if (!iso) return '-';
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return '-';

  const diffSec = Math.round((ts - Date.now()) / 1000);
  const absSec = Math.abs(diffSec);

  if (absSec < 60) return rtf.format(Math.round(diffSec / 1), 'second');
  if (absSec < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (absSec < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  return rtf.format(Math.round(diffSec / 86400), 'day');
}

// "14:20"처럼 시:분만 — "Last updated" 라벨 및 행 hover 툴팁의 절대 시각 표기에 사용.
export function formatClockTime(input: string | number): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// 서버 LocalDateTime 문자열을 파싱 없이 "MM-DD HH:mm"으로 자른다. 앱 전반이 이 시각을
// 타임존 변환 없이 벽시계 그대로 표시하는 관례를 따른다(예: entities/student mapper) — 배정 시각 표기용.
export function formatDateTimeShort(iso: string): string {
  if (!iso || iso.length < 16) return '-';
  // "2026-07-17T13:50:00" → "07-17 13:50"
  return iso.slice(5, 16).replace('T', ' ');
}

// 응시 소요 시간 = 제출 − 시작. 선생님이 학생이 얼마나 걸렸는지 즉시 읽게 한다.
// 시작 시각이 없으면(미측정/응시 후 포기 등) '-'. 1시간 미만은 "17m 30s", 그 이상은 "1h 05m".
export function formatDuration(startIso: string | null, endIso: string): string {
  if (!startIso || !endIso) return '-';
  const startMs = new Date(startIso).getTime();
  const endMs = new Date(endIso).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return '-';

  const totalSec = Math.max(0, Math.round((endMs - startMs) / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  return `${seconds}s`;
}
