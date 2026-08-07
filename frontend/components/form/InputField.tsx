'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';
import { useController } from 'react-hook-form';
import { Button } from '../ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Input as BaseInput } from '../ui/input';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  description?: string;
}
export default function InputField({
  name,
  label,
  description,
  defaultValue,
  disabled,
  ...props
}: InputProps) {
  const fieldId = `${name}-field`;
  const { field, fieldState } = useController({
    name,
    defaultValue,
    disabled,
  });
  const [show, setShow] = useState(false);

  return (
    <Field data-invalid={fieldState.invalid}>
      {label && (
        <FieldLabel className="font-medium" htmlFor={fieldId}>
          {label}
        </FieldLabel>
      )}
      <div className="relative">
        <BaseInput
          {...props}
          {...field}
          type={props.type === 'password' && show ? 'text' : props.type}
          className={cn(props.className, 'rounded-sm', { 'pr-12': props.type === 'password' })}
          id={fieldId}
          aria-invalid={fieldState.invalid}
        />
        {props.type === 'password' && (
          <Button
            className="abs-y-center right-0 active:-translate-y-1/2!"
            variant={'ghost'}
            onClick={() => setShow(!show)}
          >
            {show ? <Eye /> : <EyeOff />}
          </Button>
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
