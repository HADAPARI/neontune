interface RangeProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}
const Range = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step,
  className,
  disabled,
}: RangeProps) => {
  return (
    <input
      value={value}
      type="range"
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number.parseFloat(e.target.value))}
      className={className}
      disabled={disabled}
    />
  );
};

export default Range;
