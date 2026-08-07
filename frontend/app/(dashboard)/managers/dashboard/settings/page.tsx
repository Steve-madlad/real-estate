'use client';

import { useGetAuthUser } from '@/api/auth';
import SettingsForm from '@/components/form/SettingsForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function page() {
  const { data: user, isLoading, isError } = useGetAuthUser();

  if (isLoading) {
    return (
      <div className="flex w-full max-w-xs flex-col gap-7">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  const initialData = {
    name: user.userInfo.name,
    email: user.userInfo.email,
    phone: user.userInfo.phoneNumber,
  };

  return (
    <div className="p-5">
      <SettingsForm initialValues={initialData} userRole={user?.userRole} />
    </div>
  );
}
