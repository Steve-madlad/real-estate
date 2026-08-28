'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date) {
  return !isNaN(date.getTime());
}

type DatePickerInputProps = {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
};

export function DatePickerInput({
  value,
  onChange,
  label = 'Subscription Date',
  placeholder = 'Select a date',
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(value ?? undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!input.trim()) {
      onChange(null);
      return;
    }

    const date = new Date(input);

    if (isValidDate(date)) {
      onChange(date);
      setMonth(date);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    const nextDate = date ?? null;

    onChange(nextDate);

    if (nextDate) {
      setMonth(nextDate);
    }

    setOpen(false);
  };

  return (
    <Field>
      <FieldLabel htmlFor="date-required">{label}</FieldLabel>

      <InputGroup>
        <InputGroupInput
          id="date-required"
          value={formatDate(value)}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  id="date-picker"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                >
                  <CalendarIcon />
                  <span className="sr-only">Select date</span>
                </InputGroupButton>
              }
            />

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={value ?? undefined}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
