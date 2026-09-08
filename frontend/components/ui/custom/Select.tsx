import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface Option {
  label: string | number | React.ReactNode;
  value: string;
}

export function Select({
  options,
  value,
  placeholder,
  label,
  className,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}) {
  return (
    <SelectComponent value={value} onValueChange={onChange}>
      <SelectTrigger className={cn('w-full max-w-48', className)}>
        <SelectValue placeholder={placeholder}>
          {options.find((option) => String(option.value) === value)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label ? <SelectLabel>{label}</SelectLabel> : null}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectComponent>
  );
}
