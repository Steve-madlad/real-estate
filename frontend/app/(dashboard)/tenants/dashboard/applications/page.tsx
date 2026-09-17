'use client';

import { useGetApplications } from '@/api/applications';
import ApplicationCard from '@/components/ApplicationCard';
import Header from '@/components/Header';
import { Clock, Download, XCircle } from 'lucide-react';

export default function Applications() {
  const { data: applications } = useGetApplications();

  return (
    <div>
      <Header title="Applications" subtitle="Track and manage your property rental applications" />
      <div className="w-full">
        {applications?.map((application) => (
          <ApplicationCard key={application.id} application={application} userType={'tenant'}>
            <div className="just-between w-full gap-5 px-4 pb-4">
              {application.status === 'Approved' ? (
                <button className="align-center grow bg-yellow-100 p-4 text-yellow-700">
                  <Clock className="mr-2 size-5" />
                  The property is being rented by you untli{' '}
                  {new Date(application.lease.endDate).toLocaleDateString()}
                </button>
              ) : application.status === 'Pending' ? (
                <div className="align-center grow bg-yellow-100 p-4 text-yellow-700">
                  <Clock className="mr-2 h-5 w-5" />
                  Your application is pending approval
                </div>
              ) : (
                <button className="align-center grow bg-red-100 p-4 text-red-700">
                  <XCircle className="mr-2 size-5" />
                  Your application has been denied
                </button>
              )}

              {application.status === 'Approved' && (
                <button className="flex-center hover:bg-primary-700 hover:text-primary-50 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
                  <Download className="mr-2 size-5"></Download>
                  Download Agreement
                </button>
              )}
            </div>
          </ApplicationCard>
        ))}
      </div>
    </div>
  );
}
