'use client';

import Link from 'next/link';
import { CheckCircle2, Clock, Download, FileText, Search, XCircle } from 'lucide-react';
import { useGetApplications } from '@/api/applications';
import ApplicationCard from '@/components/ApplicationCard';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function TenantApplicationsPage() {
  const { data: applications, isLoading } = useGetApplications();

  return (
    <div className="space-y-6">
      <Header
        title="Your Rental Applications"
        subtitle="Track application statuses, review leases, and download signed agreements."
      />

      <div className="w-full space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border-border bg-card h-44 animate-pulse rounded-2xl border"
              />
            ))}
          </div>
        ) : applications && applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationCard key={application.id} application={application} userType="tenant">
              <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                {application.status === 'Approved' ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>
                      Application approved! Active lease through{' '}
                      {application.lease
                        ? new Date(application.lease.endDate).toLocaleDateString()
                        : 'agreed term'}
                    </span>
                  </div>
                ) : application.status === 'Pending' ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Clock className="size-4 shrink-0" />
                    <span>Your application is under review by the manager</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                    <XCircle className="size-4 shrink-0" />
                    <span>Application status: Denied by property manager</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Link
                    href={`/listing/${application.property.id}`}
                    className="border-border hover:bg-muted text-foreground inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-semibold"
                  >
                    View Listing
                  </Link>
                  {application.status === 'Approved' && (
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs">
                      <Download className="size-3.5" /> Download Agreement
                    </Button>
                  )}
                </div>
              </div>
            </ApplicationCard>
          ))
        ) : (
          <div className="border-border bg-card/50 flex flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed p-12 text-center">
            <div className="bg-secondary/10 text-secondary flex size-14 items-center justify-center rounded-2xl">
              <FileText className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-foreground text-lg font-bold">No applications submitted</h3>
              <p className="text-muted-foreground max-w-sm text-xs">
                When you find a home you love, apply online with a single click to track its status
                here.
              </p>
            </div>
            <Link
              href="/search"
              className="bg-secondary text-secondary-foreground inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold shadow-md"
            >
              <Search className="mr-1.5 size-4" /> Find Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
