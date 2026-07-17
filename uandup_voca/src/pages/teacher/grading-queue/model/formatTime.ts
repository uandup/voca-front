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
