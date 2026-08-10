'use client';

import { useUpdateUser } from '@/api/settings';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../ui/field';
import InputField from './InputField';
import { PhoneInput } from '../ui/phone-input';

const settingsSchema = z.object({
  name: z.string().optional(),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'min 1 num hoe'),
});

type FormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialValues: FormValues;
  userRole: UserRole;
}
export default function SettingsForm({ initialValues, userRole }: SettingsFormProps) {
  const { mutateAsync, isPending } = useUpdateUser();

  console.log({ isPending });

  const settingsForm = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
    },
  });

  const [editEnabled, setEditEnabled] = useState<boolean>(false);
  function handleToggleEdit() {
    if (editEnabled) {
      settingsForm.reset();
    }
    setEditEnabled((prev) => !prev);
  }

  async function updateProfile(data: FormValues) {
    await mutateAsync(data);
  }

  return (
    <FormProvider {...settingsForm}>
      <form onSubmit={settingsForm.handleSubmit(updateProfile)}>
        <div className="mb-5">
          <FieldLegend className="text-lg! font-semibold capitalize">
            {userRole} Settings
          </FieldLegend>
          <FieldDescription>
            Manage your account preferences and personal information
          </FieldDescription>
        </div>

        <Card className="max-w-2xl rounded-md p-5 shadow-md">
          <FieldSet disabled={!editEnabled}>
            <FieldGroup>
              <InputField name="name" label="Name" />
              <InputField name="email" type="email" label="Email" />
              <Controller
                control={settingsForm.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-medium" htmlFor={field.name}>
                      Phone Number
                    </FieldLabel>
                    <PhoneInput
                      {...field}
                      id={field.name}
                      disabled={!editEnabled}
                      placeholder="+44 xxx xxx xxx"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Include your phone number with country code.
                    </FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <div className="flex-between mt-5">
            <Button
              className={cn(editEnabled ? 'bg-primary' : 'bg-secondary-500')}
              type="button"
              disabled={isPending}
              onClick={handleToggleEdit}
            >
              {editEnabled ? 'Cancel' : 'Edit'}
            </Button>
            {editEnabled && (
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    Updating Profile <Loader2 className="animate-spin" />
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </FormProvider>
  );
}
