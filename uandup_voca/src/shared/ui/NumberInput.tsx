interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function NumberInput({ value, onChange, min, max, className = '' }: NumberInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');
    if (max !== undefined && Number(digits) > max) return;
    onChange(digits);
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      className={`rounded-xl px-4 py-2.5 text-sm outline-none ${className}`}
    />
  );
}
