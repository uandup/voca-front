// 너비를 뺀 베이스 — flex 행에서 flex-1/w-28 같은 너비를 직접 줄 때 쓴다.
// w-full을 함께 두면 같은 width 속성이 충돌하므로 베이스에 넣지 않는다.
export const inputBaseClass =
  'px-4 py-3 rounded-xl border border-outline-variant bg-white text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline';

export const selectBaseClass =
  'px-4 py-3 rounded-xl border border-outline-variant bg-white text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer';

// 폭 전체를 차지하는 단독 필드용 — 대부분의 폼 입력이 이걸 쓴다.
export const inputClass = `w-full ${inputBaseClass}`;
export const selectClass = `w-full ${selectBaseClass}`;

export const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23444652' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 16px center',
};
