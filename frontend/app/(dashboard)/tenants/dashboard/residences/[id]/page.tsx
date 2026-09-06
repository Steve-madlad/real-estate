'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetLeasePayments, useGetLeases } from '@/api/lease';
import { useGetProperty } from '@/api/properties';
import { Lease, PropertyWithLocation } from '@/types/prismaTypes';
import { Download, MapPin, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function UserResidence() {
  const { id } = useParams<{ id: string }>();

  const { data: user } = useGetAuthUser();
  const { data: property, isLoading: propertyLoading } = useGetProperty(id);
  const {
    data: leases,
    isLoading: leasesLoading,
    refetch: refetchLeases,
  } = useGetLeases({ enabled: false });
  const {
    data: leasePayments,
    isLoading: leasePaymentssLoading,
    refetch: refetchLeasePayments,
  } = useGetLeasePayments({ enabled: false });

  const currentLease = leases?.data?.find((lease) => lease.propertyId === property?.id);

  useEffect(() => {
    if (user) {
      refetchLeases();
      refetchLeasePayments();
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      <div className="mx-auto w-full gap-10 md:flex">
        {currentLease && property && (
          <ResidenceCard property={property} currentLease={currentLease} />
        )}
        {/* <PaymentMethod /> */}
      </div>
      {/* <BillingHistory payments="payments" /> */}
    </div>
  );
}

function ResidenceCard({
  property,
  currentLease,
}: {
  property: PropertyWithLocation;
  currentLease: Lease;
}) {
  return (
    <div className="col-between flex-1 overflow-hidden rounded-xl bg-white p-6 shadow-md">
      <div className="flex gap-5">
        <div className="h-32 w-64 rounded-xl bg-slate-500 object-cover"></div>
        <div className="col-between">
          <div>
            <div className="w-fit rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">
              Active Leases
            </div>

            <h2 className="my-2 text-2xl font-bold">{property.name}</h2>
            <div className="align-center mb-2">
              <MapPin className="mr-1 size-5"></MapPin>
              <span>
                {property.location.city} {property.location.country}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold">
            {currentLease.rent}
            <span className="text-sm font-normal text-gray-500">/ night</span>
          </div>
        </div>
      </div>

      <div>
        <hr className="my-4" />
        <div className="flex-between">
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">Start Date:</div>
            <div className="font-semibold">
              {new Date(currentLease.startDate).toLocaleDateString()}
            </div>
          </div>
          <div className="5px border-primary-300 h-4 border-0"></div>
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">End Date:</div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="5px border-primary-300 h-4 border-0"></div>
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">Next Payment:</div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <hr className="my-4"></hr>
      </div>

      <div className="just-end w-full gap-2">
        <button className="align-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
          <User className="mr-2 size-5">Manager</User>
        </button>
        <button className="align-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
          <Download className="mr-2 size-5">Download Agreement</Download>
        </button>
      </div>
    </div>
  );
}
