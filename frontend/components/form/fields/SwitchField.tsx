'use client';

import Switch, { CustomSwitchProps } from '@/components/ui/custom/Switch';
import { useController } from 'react-hook-form';
import { Field, FieldDescription, FieldLabel } from '../../ui/field';

interface SwitchFieldProps extends Omit<CustomSwitchProps, 'value' | 'onChange'> {
  name: string;
  label: string;
  description?: string;
  value?: string;
  onChange?: (value: boolean) => void;
}

export default function SwitchField({ name, description, label, ...props }: SwitchFieldProps) {
  const fieldId = `${name}-field`;
  const { field, fieldState } = useController({ name });

  return (
    <Field data-invalid={fieldState.invalid}>
      <Switch
        {...field}
        {...props}
        checked={field.value}
        onCheckedChange={field.onChange}
        id={props.id || fieldId}
      />
      {label && (
        <FieldLabel className="font-medium" htmlFor={props.id || fieldId}>
          {label}
        </FieldLabel>
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
