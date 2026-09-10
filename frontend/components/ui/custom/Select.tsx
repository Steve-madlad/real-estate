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
import React from 'react';
import {
  Combobox as ComboboxBase,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '../combobox';

export interface Option {
  label: string | number | React.ReactNode;
  value: string;
}

interface SharedSelectProps {
  options: Option[];
  id?: string;
  placeholder?: string;
  invalid?: boolean;
  label?: string;
  className?: string;
}

type SingleSelectProps = SharedSelectProps & {
  multiple?: false;
  value: string | null;
  onChange: (value: string | null) => void;
};

type MultipleSelectProps = SharedSelectProps & {
  multiple: true;
  value: string[];
  emptyText?: string;
  showClear?: boolean;
  onChange: (value: string[]) => void;
};

export type SelectProps = SingleSelectProps | MultipleSelectProps;

export function Select({
  options,
  value,
  onChange,
  multiple,
  id,
  placeholder,
  invalid,
  label,
  className,
}: SelectProps) {
  return (
    <>
      {multiple ? (
        <Combobox
          options={options}
          value={value}
          onChange={onChange}
          multiple
          id={id}
          placeholder={placeholder}
          invalid={invalid}
          label={label}
          className={className}
        />
      ) : (
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
      )}
    </>
  );
}

function Combobox({
  options,
  value,
  onChange,
  id,
  placeholder,
  invalid,
  className,
  emptyText,
  showClear,
}: MultipleSelectProps) {
  const anchor = useComboboxAnchor();

  return (
    <ComboboxBase multiple items={options} value={value} onValueChange={onChange}>
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values?.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                className={className}
                id={id}
                aria-invalid={invalid}
                placeholder={placeholder}
              />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent className="w-full">
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(option) => (
            <ComboboxItem key={option.value} value={option.value}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </ComboboxBase>
  );
}
