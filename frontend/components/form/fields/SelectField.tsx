'use client';

import { Select, SelectProps } from '@/components/ui/custom/Select';
import { useController } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../ui/field';

interface SelectFieldProps extends Omit<SelectProps, 'value' | 'onChange'> {
  name: string;
  label: string;
  description?: string;
  value?: string;
  onChange?: (value: string | null) => void;
}

export default function SelectField({ name, description, label, ...props }: SelectFieldProps) {
  const fieldId = `${name}-field`;
  const { field, fieldState } = useController({ name });

  return (
    <Field data-invalid={fieldState.invalid}>
      {label && (
        <FieldLabel className="font-medium" htmlFor={props.id || fieldId}>
          {label}
        </FieldLabel>
      )}
      <Select {...props} {...field} invalid={fieldState.invalid} id={props.id || fieldId} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
