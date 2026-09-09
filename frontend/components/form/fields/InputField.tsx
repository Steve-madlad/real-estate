'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { HTMLInputTypeAttribute, InputHTMLAttributes, useState } from 'react';
import { useController } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../ui/field';
import { Input as BaseInput } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name: string;
  label?: string;
  description?: string;
  type?: HTMLInputTypeAttribute | 'textarea';
}
export default function InputField({
  name,
  label,
  description,
  defaultValue,
  disabled,
  type,
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
        <FieldLabel className="font-medium" htmlFor={props.id || fieldId}>
          {label}
        </FieldLabel>
      )}
      <div className="relative">
        {type === 'textarea' ? (
          <Textarea
            {...props}
            {...field}
            className={cn(props.className, 'rounded-sm')}
            id={props.id || fieldId}
            aria-invalid={fieldState.invalid}
          />
        ) : (
          <BaseInput
            {...props}
            {...field}
            type={type === 'password' && show ? 'text' : type}
            className={cn(props.className, 'rounded-sm', { 'pr-12': type === 'password' })}
            id={props.id || fieldId}
            aria-invalid={fieldState.invalid}
          />
        )}
        {type === 'password' && (
          <Button
            className="abs-y-center right-0 active:-translate-y-1/2!"
            variant={'ghost'}
            type="button"
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
