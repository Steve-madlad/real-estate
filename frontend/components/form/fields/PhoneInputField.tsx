import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { PhoneInput, PhoneInputProps } from '@/components/ui/phone-input';
import { useController } from 'react-hook-form';

interface PhoneInputFieldProps extends PhoneInputProps {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}
export default function PhoneInputField({
  name,
  label,
  description,
  disabled,
  ...props
}: PhoneInputFieldProps) {
  const { field, fieldState } = useController({
    name,
  });
  const fieldId = props.id || `${name}-field`;

  return (
    <Field data-invalid={fieldState.invalid}>
      {label && (
        <FieldLabel className="font-medium" htmlFor={fieldId}>
          {label}
        </FieldLabel>
      )}
      <PhoneInput
        {...field}
        {...props}
        name={name}
        id={fieldId}
        disabled={disabled}
        countryCallingCodeEditable={false}
        international
        placeholder="+44 xxx xxx xxx"
        aria-invalid={fieldState.invalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
