export const inputClass =
  "w-full px-4 py-3 rounded-xl border border-outline-variant bg-white text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline";

export const selectClass =
  "w-full px-4 py-3 rounded-xl border border-outline-variant bg-white text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer";

export const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23444652' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 16px center",
};

export const GRADES = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
