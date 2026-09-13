'use client';

import { ApplicationStatus, useGetApplications, useProcessApplications } from '@/api/applications';
import ApplicationCard from '@/components/ApplicationCard';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CircleCheckBig, Download, File, Hospital } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const statuses = ['all', 'pending', 'approved', 'denied'] as const;
export default function Applications() {
  const [activeTab, setActiveTab] = useState<(typeof statuses)[number]>('all');
  const { data: applications } = useGetApplications();
  const { mutate: processApplication } = useProcessApplications();

  const handleStatusChange = (id: number, body: { status: ApplicationStatus }) => {
    processApplication({ id, body });
  };

  const filteredApplications = applications?.filter((application) => {
    if (activeTab === 'all') return true;
    return application.status.toLowerCase() === activeTab;
  });

  return (
    <div className="dashboard-container">
      <Header title="Applications" subtitle="View and manage applications for your properties" />
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
                (application) => tab === 'all' || application.status.toLocaleLowerCase() === tab,
              )
              .map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType={'manager'}
                >
                  <div className="just-between w-full gap-5 px-4 pb-4">
                    <div
                      className={cn(`grow bg-yellow-100 p-4 text-green-500`, {
                        'bg-green-100!': application.status === 'Approved',
                        'bg-red-100!': application.status === 'Denied',
                      })}
                    >
                      <div className="align-center flex-wrap">
                        <File className="mr-2 size-5 shrink-0"></File>
                        <span>
                          Application submitted on{' '}
                          {new Date(application.applicationDate).toDateString()} •
                        </span>
                        <CircleCheckBig className="mr-2 size-5 shrink-0"></CircleCheckBig>
                        <span
                          className={cn(`font-semibold text-yellow-800`, {
                            'text-green-800!': application.status === 'Approved',
                            'text-red-800!': application.status === 'Denied',
                          })}
                        >
                          This application
                          {application.status === 'Pending'
                            ? 'is pending review'
                            : 'has been ' + application.status.toLocaleLowerCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        className="flex-center hover:bg-primary-700 hover:text-primary-50 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700"
                        href="`/managers/properties/application.property.id`"
                        scroll={false}
                      >
                        <Hospital className="mr-2 size-5"></Hospital>
                        Property Details
                      </Link>
                      {application.status === 'Approved' && (
                        <button className="flex-center hover:bg-primary-700 hover:text-primary-50 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
                          <Download className="mr-2 size-5"></Download>
                          Download Agreement
                        </button>
                      )}

                      {application.status === 'Pending' && (
                        <>
                          <button
                            className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-500"
                            onClick={() =>
                              handleStatusChange(application.id, { status: 'Approved' })
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                            onClick={() => handleStatusChange(application.id, { status: 'Denied' })}
                          >
                            Deny
                          </button>
                        </>
                      )}

                      {application.status === 'Denied' && (
                        <button className="flex-center hover:bg-secondary-500 hover:text-primary-50 rounded-md bg-gray-800 px-4 py-2 text-white">
                          Contact User
                        </button>
                      )}
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
