'use client';

import { ApplicationStatus, useGetApplications, useProcessApplications } from '@/api/applications';
import ApplicationCard from '@/components/ApplicationCard';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CircleCheckBig, File } from 'lucide-react';
import { useState } from 'react';

const statuses = ['all', 'pending', 'approved', 'denied'] as const;
export default function Applications() {
  const [activeTab, setActiveTab] = useState<(typeof statuses)[number]>('all');
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
          {statuses.map((tab) => (
            <TabsTrigger key={tab} value={tab}></TabsTrigger>
          ))}
        </TabsList>
        {statuses.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-5 w-full">
            {filteredApplications
              ?.filter(
                (appliaction) => tab === 'all' || appliaction.status.toLocaleLowerCase() === tab,
              )
              .map((appliaction) => (
                <ApplicationCard
                  key={appliaction.id}
                  application={appliaction}
                  userType={'manager'}
                >
                  <div className="just-between w-full gap-5 px-4 pb-4">
                    <div
                      className={cn(`grow bg-yellow-100 p-4 text-green-500`, {
                        'bg-green-100!': appliaction.status === 'Approved',
                        'bg-red-100!': appliaction.status === 'Denied',
                      })}
                    >
                      <div className="align-center flex-wrap">
                        <File className="mr-2 size-5 shrink-0"></File>
                        <span>
                          Application submitted on{' '}
                          {new Date(appliaction.applicationDate).toDateString()} •
                        </span>
                        <CircleCheckBig className="mr-2 size-5 shrink-0"></CircleCheckBig>
                        <span
                          className={cn(`font-semibold text-yellow-800`, {
                            'text-green-800!': appliaction.status === 'Approved',
                            'text-red-800!': appliaction.status === 'Denied',
                          })}
                        >
                          This application
                          {appliaction.status === 'Pending'
                            ? 'is pending review'
                            : 'has been ' + appliaction.status.toLocaleLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </ApplicationCard>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
