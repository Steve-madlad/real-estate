'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetLeasePayments, useGetLeases } from '@/api/lease';
import { useGetProperty } from '@/api/properties';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lease, Payment, PropertyWithLocation } from '@/types/prismaTypes';
import {
  ArrowDownToLineIcon,
  Check,
  CreditCard,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  Table,
  User,
} from 'lucide-react';
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
    <div className="dashboard-container">
      <div className="mx-auto w-full gap-10 md:flex">
        {currentLease && property && (
          <ResidenceCard property={property} currentLease={currentLease} />
        )}
        <PaymentMethod />
      </div>
      {/* {leasePayments?.data && <BillingHistory payments={leasePayments?.data} />} */}
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

function PaymentMethod() {
  return (
    <div className="md overlfow-hidden mt-10 flex-1 rounded-xl bg-white p-6 shadow md:mt-0">
      <h2 className="mb-3 text-3xl font-bold">Payment Method</h2>
      <p className="mb-4">Change how you pay for your plan</p>
      <div className="border-rounded-lg p-5">
        <div>
          <div className="flex-gap-10">
            <div className="flex-center h-20 w-36 rounded-md bg-blue-200">
              <span className="text-2xl font-bold text-white">VISA</span>
            </div>
            <div className="col-between">
              <div>
                <div className="flex-gap-5">
                  <h3 className="text-lg font-semibold">Visa ending in 2024</h3>
                  <span className="border-primary-700 text-primary-700 border px-3 text-sm font-medium">
                    Default
                  </span>
                </div>
                <div className="txt-sm align-center text-gray-500">
                  <CreditCard className="mr-1 size-4"></CreditCard>
                  <span>Expiry • 26/06/2024</span>
                </div>
              </div>
              <div className="align-center text-sm text-gray-500">
                <Mail className="mr-1 size-4"></Mail>
                <span>billing@baseclub.com</span>
              </div>
            </div>
          </div>

          <hr className="my-4" />
          <div className="just-end">
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
              <Edit className="mr-2 size-5"></Edit>
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
      <div className="flex-between">
        <div>
          <h2 className="mb-1 text-2xl font-bold">Billing History</h2>
          <p className="text-sm text-gray-500">
            Download your previous plan receipts and usage details
          </p>
        </div>
        <div>
          <button className="border-border-gray-300 bg-white px-4 py-2 text-gray-700">
            <Download className="mr-2 size-5"></Download>
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
                    <FileText className="mr-2 h-4 w-4" />
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
                      <Check className="mr-1 inline-block h-4 w-4" />
                    ) : null}
                    {payment.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>
                <TableCell>
                  <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700">
                    <ArrowDownToLineIcon className="mr-1 h-4 w-4" />
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
