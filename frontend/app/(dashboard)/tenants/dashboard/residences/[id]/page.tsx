'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetLeasePayments, useGetLeases } from '@/api/lease';
import { useGetProperty } from '@/api/properties';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Lease, Payment, PropertyWithLocation } from '@/types/prismaTypes';
import {
  ArrowDownToLineIcon,
  ArrowLeft,
  Check,
  CreditCard,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
  } = useGetLeasePayments(id, { enabled: false });

  const currentLease = leases?.data?.find((lease) => lease.propertyId === property?.id);

  useEffect(() => {
    if (user) {
      refetchLeases();
      refetchLeasePayments();
    }
  }, [user]);

  return (
    <div>
      <div className="mx-auto w-full gap-10 md:flex">
        {currentLease && property && (
          <ResidenceCard property={property} currentLease={currentLease} />
        )}
        <PaymentMethod />
      </div>
      {leasePayments?.data && <BillingHistory payments={leasePayments?.data} />}
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
    <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-md">
      {/* Header */}
      <Link
        href="/tenants/dashboard/residences"
        className="hover:text-primary-500 mb-4 flex items-center"
        scroll={false}
      >
        <ArrowLeft className="mr-2 size-4" />
        <span>Back to Residences</span>
      </Link>

      <div className="flex gap-5">
        <div className="relative h-32 w-64 overflow-hidden rounded-xl bg-slate-500 object-cover">
          <Image
            className="object-cover"
            src={property.photoUrls[0] || '/placeholder.jpg'}
            alt={property.name}
            fill
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="w-fit rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">
              Active Leases
            </div>

            <h2 className="my-2 text-2xl font-bold">{property.name}</h2>
            <div className="mb-2 flex items-center">
              <MapPin className="mr-1 h-5 w-5" />
              <span>
                {property.location.city}, {property.location.country}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold">
            ${currentLease.rent} <span className="text-sm font-normal text-gray-500">/ night</span>
          </div>
        </div>
      </div>
      {/* Dates */}
      <div>
        <hr className="my-4" />
        <div className="flex items-center justify-between">
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">Start Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.startDate).toLocaleDateString()}
            </div>
          </div>
          <div className="border-primary-300 h-4 border-[0.5px]" />
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">End Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="border-primary-300 h-4 border-[0.5px]" />
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">Next Payment: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      {/* Buttons */}
      <div className="flex w-full justify-end gap-2">
        <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
          <User className="mr-2 h-5 w-5" />
          Manager
        </button>
        <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
          <Download className="mr-2 h-5 w-5" />
          Download Agreement
        </button>
      </div>
    </div>
  );
}

function PaymentMethod() {
  return (
    <div className="mt-10 flex-1 overflow-hidden rounded-xl bg-white p-6 shadow-md md:mt-0">
      <h2 className="mb-4 text-2xl font-bold">Payment method</h2>
      <p className="mb-4">Change how you pay for your plan.</p>
      <div className="rounded-lg border p-6">
        <div>
          {/* Card Info */}
          <div className="flex gap-10">
            <div className="flex h-20 w-36 items-center justify-center rounded-md bg-blue-600">
              <span className="text-2xl font-bold text-white">VISA</span>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-5">
                  <h3 className="text-lg font-semibold">
                    Visa ending in {new Date().getFullYear()}
                  </h3>
                  <span className="border-primary-700 text-primary-700 rounded-full border px-3 py-1 text-sm font-medium">
                    Default
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CreditCard className="mr-1 size-4" />
                  <span>Expiry • 26/06/{new Date().getFullYear()}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="mr-1 size-4" />
                <span>billing@baseclub.com</span>
              </div>
            </div>
          </div>

          <hr className="my-4" />
          <div className="flex justify-end">
            <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
              <Edit className="mr-2 h-5 w-5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingHistory({ payments }: { payments: Payment[] }) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-white p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-bold">Billing History</h2>
          <p className="text-sm text-gray-500">
            Download your previous plan receipts and usage details.
          </p>
        </div>
        <div>
          <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
            <Download className="mr-2 h-5 w-5" />
            <span>Download All</span>
          </button>
        </div>
      </div>
      <hr className="mt-4 mb-1" />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Billing Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="h-16">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 size-4" />
                    Invoice #{payment.id} -{' '}
                    {new Date(payment.paymentDate).toLocaleString('default', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                      payment.paymentStatus === 'Paid'
                        ? 'border-green-300 bg-green-100 text-green-800'
                        : 'border-yellow-300 bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.paymentStatus === 'Paid' ? (
                      <Check className="mr-1 inline-block size-4" />
                    ) : null}
                    {payment.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>
                <TableCell>
                  <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700">
                    <ArrowDownToLineIcon className="mr-1 size-4" />
                    Download
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
