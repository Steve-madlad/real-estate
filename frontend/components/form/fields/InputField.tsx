'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';
import { useController } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../ui/field';
import { Input as BaseInput } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

import { TextareaHTMLAttributes } from 'react';

type BaseProps = {
  name: string;
  label?: string;
  description?: string;
};

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type: 'textarea';
  };

type Props = InputProps | TextareaProps;

function isTextarea(props: Props): props is TextareaProps {
  return props.type === 'textarea';
}

export default function InputField(props: Props) {
  const fieldId = `${props.name}-field`;
  const { field, fieldState } = useController({
    name: props.name,
    defaultValue: props.defaultValue,
    disabled: props.disabled,
  });
  const [show, setShow] = useState(false);

  return (
    <Field data-invalid={fieldState.invalid}>
      {props.label && (
        <FieldLabel className="font-medium" htmlFor={props.id || fieldId}>
          {props.label}
        </FieldLabel>
      )}
      <div className="relative">
        {isTextarea(props) ? (
          <TextareaField
            props={props}
            field={field}
            invalid={fieldState.invalid}
            fieldId={fieldId}
          />
        ) : (
          <BaseInput
            {...props}
            {...field}
            type={props.type === 'password' && show ? 'text' : props.type}
            className={cn(props.className, 'rounded-sm', { 'pr-12': props.type === 'password' })}
            id={props.id || fieldId}
            aria-invalid={fieldState.invalid}
          />
        )}
        {props.type === 'password' && (
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
      {props.description && <FieldDescription>{props.description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

function TextareaField({
  props,
  field,
  invalid,
  fieldId,
}: {
  props: TextareaProps;
  field: ReturnType<typeof useController>['field'];
  invalid: boolean;
  fieldId: string;
}) {
  const { type: _type, ...textareaProps } = props;

  return (
    <Textarea
      {...textareaProps}
      {...field}
      className={cn(props.className, 'rounded-sm')}
      id={props.id || fieldId}
      aria-invalid={invalid}
    />
  );
}
