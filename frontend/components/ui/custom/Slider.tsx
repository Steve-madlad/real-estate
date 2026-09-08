import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  onChange: (value: number | readonly number[]) => void;
  value?: number[];
  defaultValue?: number[];
  className?: string;
}

export function SliderRange({
  defaultValue,
  value,
  min,
  max,
  step,
  onChange,
  className,
}: SliderProps) {
  return (
    <Slider
      onValueChange={onChange}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      className={cn(className)}
    />
  );
}
