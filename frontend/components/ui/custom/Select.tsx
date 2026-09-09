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

export interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string | null) => void;
  id?: string;
  placeholder?: string;
  invalid?: boolean;
  label?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  id,
  placeholder,
  invalid,
  label,
  className,
}: SelectProps) {
  return (
    <SelectComponent value={value} onValueChange={onChange}>
      <SelectTrigger aria-invalid={invalid} id={id} className={cn('w-full', className)}>
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
