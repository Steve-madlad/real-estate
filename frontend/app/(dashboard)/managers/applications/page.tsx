'use client';

import { ApplicationStatus, useGetApplications, useProcessApplications } from '@/api/applications';
import Header from '@/components/Header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const tabs = ['all', 'pending', 'approved', 'denied'] as const;
export default function Applications() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('all');
  const { data: applications } = useGetApplications();
  const { mutate: processApplication } = useProcessApplications();

  const handleStatusChange = (id: string, body: { status: ApplicationStatus }) => {
    processApplication({ id, body });
  };

  const filteredApplications = applications?.filter((application) => {
    if (activeTab === 'all') return true;
    return application.status.toLowerCase() === activeTab;
  });

  return (
    <div className="dashboard-container">
      <Header title="Applications" subtitle="View and manage appliactions for your properties" />
      <Tabs className="my-5 w-full" value="activeTab" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <div>
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}></TabsTrigger>
            ))}
          </div>
        </TabsList>
      </Tabs>
    </div>
  );
}
