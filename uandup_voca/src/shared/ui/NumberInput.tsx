interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  disabled,
  className = '',
}: NumberInputProps) {
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
      disabled={disabled}
      className={className}
    />
  );
}
