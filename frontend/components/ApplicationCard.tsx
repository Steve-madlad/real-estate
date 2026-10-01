'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { Mail, MapPin, PhoneCall, Calendar, ShieldCheck, Clock } from 'lucide-react';
import { UserRole } from '@/types';
import { ApplicationWithRelations } from '@/types/prismaTypes';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: ApplicationWithRelations;
  userType: UserRole;
  children?: ReactNode;
}

export default function ApplicationCard({ application, userType, children }: ApplicationCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    application.property.photoUrls?.[0] || '/placeholder.jpg',
  );

  const contactPerson = userType === 'manager' ? application.tenant : application.manager;

  const statusVariant =
    application.status === 'Approved'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : application.status === 'Denied'
        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

  return (
    <div className="border-border/80 bg-card text-card-foreground mb-5 overflow-hidden rounded-2xl border shadow-xs transition-all hover:shadow-md">
      <div className="grid grid-cols-1 items-start gap-6 p-5 sm:p-6 lg:grid-cols-12">
        {/* Left: Property Preview (5 cols) */}
        <div className="flex flex-col gap-4 sm:flex-row lg:col-span-5">
          <div className="bg-muted relative aspect-[4/3] shrink-0 overflow-hidden rounded-xl sm:w-44">
            <Image
              src={imgSrc}
              alt={application.property.name}
              fill
              unoptimized
              className="object-cover"
              onError={() => setImgSrc('/placeholder.jpg')}
            />
          </div>

          <div className="flex flex-col justify-between space-y-2">
            <div>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <MapPin className="text-secondary size-3.5 shrink-0" />
                <span className="truncate">
                  {application.property.location.city}, {application.property.location.country}
                </span>
              </div>
              <h3 className="text-foreground mt-1 text-base font-bold">
                {application.property.name}
              </h3>
            </div>

            <div className="pt-2">
              <span className="text-foreground text-base font-extrabold">
                ${application.property.pricePerMonth.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs"> / month</span>
            </div>
          </div>
        </div>

        {/* Center: Lease / Application Status (4 cols) */}
        <div className="bg-muted/40 border-border/60 space-y-2.5 rounded-xl border p-4 text-xs lg:col-span-4">
          <div className="border-border/60 flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground font-medium">Application Status</span>
            <Badge
              variant="outline"
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
                statusVariant,
              )}
            >
              {application.status}
            </Badge>
          </div>

          {application.lease ? (
            <>
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Lease Start:</span>
                <span className="text-foreground font-semibold">
                  {new Date(application.lease.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Lease End:</span>
                <span className="text-foreground font-semibold">
                  {new Date(application.lease.endDate).toLocaleDateString()}
                </span>
              </div>
              {application.lease.nextPaymentDate && (
                <div className="text-muted-foreground flex items-center justify-between">
                  <span>Next Due:</span>
                  <span className="text-foreground font-semibold">
                    {new Date(application.lease.nextPaymentDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground flex items-center gap-2 py-1">
              <Clock className="size-4 text-amber-500" />
              <span>Under review by manager</span>
            </div>
          )}
        </div>

        {/* Right: Contact Person (3 cols) */}
        <div className="space-y-3 lg:col-span-3">
          <span className="text-muted-foreground block text-xs font-bold tracking-wider uppercase">
            {userType === 'manager' ? 'Applicant Details' : 'Property Manager'}
          </span>

          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {contactPerson?.name ? contactPerson.name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-foreground truncate text-xs font-bold">{contactPerson?.name}</p>
              <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate text-[11px]">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{contactPerson?.email}</span>
              </div>
              {contactPerson?.phoneNumber && (
                <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate text-[11px]">
                  <PhoneCall className="size-3 shrink-0" />
                  <span>{contactPerson.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {children && (
        <div className="bg-muted/20 border-border/60 flex items-center justify-end gap-2 border-t px-5 py-3.5">
          {children}
        </div>
      )}
    </div>
  );
}
