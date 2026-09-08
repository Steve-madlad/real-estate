'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetLeasePayments } from '@/api/lease';
import { useGetPropertyLeases } from '@/api/manager';
import { useGetProperty } from '@/api/properties';
import Header from '@/components/Header';
import { TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/table';
import { TableRow } from '@aws-amplify/ui-react';
import { ArrowDownToLine, ArrowLeft, Check, Download, Table } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Properties() {
  const { id } = useParams<{ id: string }>();

  const { data: user } = useGetAuthUser();
  const { data: property, isLoading: propertyLoading } = useGetProperty(id);

  const {
    data: leases,
    isLoading: leaseLoading,
    refetch: refetchLeases,
  } = useGetPropertyLeases(id, { enabled: false });

  const {
    data: payments,
    isLoading: leasePaymentsLoading,
    refetch: refetchPayments,
  } = useGetLeasePayments(id, {
    enabled: false,
  });

  useEffect(() => {
    if (user?.userRole === 'manager') {
      refetchPayments();
      refetchLeases();
    }
  }, [user?.userRole]);

  const getCurrentMonthPaymentStatus = (leaseId: number) => {
    const today = new Date();
    const currentMonthPayment = payments?.data?.find(
      (payment) =>
        payment.leaseId === leaseId &&
        new Date(payment.dueDate).getMonth() === today.getMonth() &&
        new Date(payment.dueDate).getFullYear() === today.getFullYear(),
    );

    return currentMonthPayment?.paymentStatus || 'Not Paid';
  };

  return (
    <div>
      <Link
        className="align-center hover:text-primary-500 mb-4"
        href="/managers/properties"
        scroll={false}
      >
        <ArrowLeft className="mr-2 size-4"></ArrowLeft>
        <span>Back to Properties</span>
      </Link>

      <Header
        title={property?.name || 'Your Property'}
        subtitle="Manage tenants and leases for this property"
      />
      <div className="w-full space-y-6">
        <div className="mt-8 overflow-hidden rounded-xl bg-white p-6 shadow-md">
          <div className="flex-center mb-4">
            <div>
              <h2 className="mb-1 text-2xl font-bold">Tenants Overview</h2>
              <p className="text-sm text-gray-500">Manage and view all tenants for this property</p>
            </div>
            <div>
              <button className="bg-white-border-border-gray-300 flex-center hover:bg-primary-700 hover:text-primary-50 rounded-md px-4 py-2 text-gray-700">
                <Download className="mr-2 size-5" />
                <span>Download All</span>
              </button>
            </div>
          </div>
          <hr className="mt-4 mb-1" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Current Month Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases?.data?.map((lease) => (
                  <TableRow key={lease.id} className="h-24">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src="/landing-i1.png"
                          alt={lease.tenant.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{lease.tenant.name}</div>
                          <div className="text-sm text-gray-500">{lease.tenant.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{new Date(lease.startDate).toLocaleDateString()} -</div>
                      <div>{new Date(lease.endDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>${lease.rent.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          getCurrentMonthPaymentStatus(lease.id) === 'Paid'
                            ? 'border-green-300 bg-green-100 text-green-800'
                            : 'border-red-300 bg-red-100 text-red-800'
                        }`}
                      >
                        {getCurrentMonthPaymentStatus(lease.id) === 'Paid' && (
                          <Check className="mr-1 inline-block h-4 w-4" />
                        )}
                        {getCurrentMonthPaymentStatus(lease.id)}
                      </span>
                    </TableCell>
                    <TableCell>{lease.tenant.phoneNumber}</TableCell>
                    <TableCell>
                      <button
                        className={`hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700`}
                      >
                        <ArrowDownToLine className="mr-1 h-4 w-4" />
                        Download Agreement
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
