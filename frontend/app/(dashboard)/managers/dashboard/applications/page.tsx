'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Download, ExternalLink, FileText, Mail, XCircle } from 'lucide-react';
import { ApplicationStatus, useGetApplications, useProcessApplications } from '@/api/applications';
import ApplicationCard from '@/components/ApplicationCard';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const statuses = ['all', 'pending', 'approved', 'denied'] as const;

export default function ManagerApplicationsPage() {
  const [activeTab, setActiveTab] = useState<(typeof statuses)[number]>('all');
  const { data: applications, isLoading } = useGetApplications();
  const { mutate: processApplication } = useProcessApplications();

  const handleStatusChange = (id: number, body: { status: ApplicationStatus }) => {
    processApplication({ id, body });
  };

  const filteredApplications = applications?.filter((application) => {
    if (activeTab === 'all') return true;
    return application.status.toLowerCase() === activeTab;
  });

  return (
    <div className="space-y-6">
      <Header
        title="Rental Applications"
        subtitle="Review prospective tenant applications, credit profiles, and approval workflows."
      />

      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as typeof activeTab)}
      >
        <TabsList className="bg-muted max-w-md rounded-2xl p-1">
          {statuses.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-xl text-xs font-bold capitalize transition-all"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border-border bg-card h-44 animate-pulse rounded-2xl border"
                />
              ))}
            </div>
          ) : filteredApplications && filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} userType="manager">
                <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <FileText className="text-secondary size-4 shrink-0" />
                    <span>
                      Submitted on {new Date(application.applicationDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/managers/dashboard/properties/${application.property.id}`}
                      className="border-border hover:bg-muted text-foreground inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-semibold"
                    >
                      <span>Property Details</span>
                      <ExternalLink className="ml-1 size-3.5" />
                    </Link>

                    {application.status === 'Pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(application.id, { status: 'Approved' })}
                          className="gap-1.5 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="size-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(application.id, { status: 'Denied' })}
                          className="gap-1.5 rounded-xl text-xs font-bold shadow-xs"
                        >
                          <XCircle className="size-3.5" /> Deny
                        </Button>
                      </>
                    )}

                    {application.status === 'Approved' && (
                      <Button variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs">
                        <Download className="size-3.5" /> Agreement PDF
                      </Button>
                    )}
                  </div>
                </div>
              </ApplicationCard>
            ))
          ) : (
            <div className="border-border bg-card/50 flex flex-col items-center justify-center space-y-3 rounded-3xl border border-dashed p-12 text-center">
              <Clock className="text-muted-foreground size-10" />
              <h3 className="text-foreground text-base font-bold">No applications in this view</h3>
              <p className="text-muted-foreground max-w-xs text-xs">
                When prospective tenants submit an application, they will appear here for your
                review.
              </p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
