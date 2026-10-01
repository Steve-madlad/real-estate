'use client';

import { useGetAuthUser } from '@/api/auth';
import Header from '@/components/Header';
import SettingsForm from '@/components/form/SettingsForm';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TenantSettingsPage() {
  const { data: user, isLoading, isError } = useGetAuthUser();

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="border-border bg-card space-y-4 rounded-2xl border p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/3" />
        </div>
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
    <div className="max-w-2xl space-y-6">
      <Header
        title="Tenant Profile & Settings"
        subtitle="Update your personal details used for rental applications and lease agreements."
      />
      <Card className="border-border/80 bg-card rounded-3xl border p-6 shadow-xs sm:p-8">
        <SettingsForm initialValues={initialData} userRole={user.userRole} />
      </Card>
    </div>
  );
}
