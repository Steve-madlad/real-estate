'use client';

import { cn } from '@/lib/utils';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin, type FilePondProps } from 'react-filepond';
import { useController } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../ui/field';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface FilePondFieldProps extends Omit<FilePondProps, 'files' | 'name' | 'onupdatefiles'> {
  name: string;
  label?: string;
  description?: string;
}

export default function FilePondField({
  name,
  label,
  description,
  id,
  className,
  allowMultiple = true,
  ...props
}: FilePondFieldProps) {
  const fieldId = id || `${name}-field`;
  const { field, fieldState } = useController({ name });
  const files = (field.value as File[] | undefined) ?? [];

  return (
    <Field data-invalid={fieldState.invalid}>
      {label && (
        <FieldLabel className="font-medium" htmlFor={fieldId}>
          {label}
        </FieldLabel>
      )}
      <FilePond
        {...props}
        name={name}
        id={fieldId}
        files={files}
        acceptedFileTypes={['images/*']}
        allowMultiple={allowMultiple}
        className={cn(className, { 'filepond--error': fieldState.invalid })}
        labelIdle={'Drag & Drop your images or <span class="filepond--label-action">Browse</span>'}
        credits={false}
        onupdatefiles={(fileItems) => {
          field.onChange(fileItems.map((fileItem) => fileItem.file as File));
          field.onBlur();
        }}
      />
      {description && <FieldDescription className="-translate-y-2">{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
