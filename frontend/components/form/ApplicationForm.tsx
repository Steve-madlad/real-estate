import { useCreateApplication } from '@/api/applications';
import { useGetAuthUser } from '@/api/auth';
import { applicationSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '../ui/button';
import InputField from './fields/InputField';

export default function ApplicationForm({
  propertyId,
  onSuccess,
}: {
  propertyId: number;
  onSuccess: () => void;
}) {
  const { data: user } = useGetAuthUser();
  const { mutate: createApplication, isPending } = useCreateApplication({
    onSuccess: () => {
      onSuccess();
      toast.success('Application submitted successfully');
    },
  });

  const applicationForm = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: user?.userInfo.name || '',
      email: user?.userInfo.email || '',
      phoneNumber: user?.userInfo.phoneNumber || '',
      message: '',
    },
  });

  const handleSubmit = (data: z.infer<typeof applicationSchema>) => {
    const body = {
      propertyId,
      ...data,
    };
    createApplication(body);
  };
  return (
    <FormProvider {...applicationForm}>
      <form action="" onSubmit={applicationForm.handleSubmit(handleSubmit)}>
        <InputField name="name" label="Name" />
        <InputField name="email" type="email" label="Email" />
        <InputField name="phoneNumber" label="Phone Number" />
        <InputField name="message" label="Message (optional)" type="textarea" />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}Submit Application
        </Button>
      </form>
    </FormProvider>
  );
}
