'use client';

import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
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

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date ?? null);

    setOpen(false);
  };

  return (
    <Field>
      <FieldLabel htmlFor="date-required">{label}</FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id="date-required"
              variant="outline"
              className="w-full justify-between font-normal"
            >
              {value ? formatDate(value) : placeholder}
              <CalendarIcon />
            </Button>
          }
        />

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            defaultMonth={value ?? new Date()}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
