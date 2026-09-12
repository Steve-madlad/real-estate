import { UserRole } from '@/types';
import { ApplicationWithRelations } from '@/types/prismaTypes';
import { Mail, MapPin, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

interface ApplicationCardProps {
  application: ApplicationWithRelations;
  userType: UserRole;
  children: ReactNode;
}

export default function ApplicationCard({ application, userType, children }: ApplicationCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    application.property.photoUrls[0] || '/placeholder.jpg',
  );

  const statusColor =
    application.status === 'Approved'
      ? 'bg-green-500'
      : application.status === 'Denied'
        ? 'bg-red-500'
        : 'bg-yellow-500';

  const contactPerson = userType === 'manager' ? application.manager : application.tenant;

  return (
    <div className="mb-4 overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="col-start justify-between gap-6 px-6 py-6 md:px-4 lg:flex-row lg:gap-4">
        <div className="col-start w-full gap-5 lg:w-auto lg:flex-row">
          <Image
            className="5 w-full rounded-xl object-cover lg:h-37 lg:w-50"
            src={imgSrc}
            alt={application.property.name}
            width={200}
            height={150}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc('/placeholder.jpg')}
          />
          <div className="col-between">
            <div>
              <h2 className="my-2 text-xl font-bold">{application.property.name}</h2>
              <div className="align-center mb-2">
                <MapPin className="mr-1 size-5"></MapPin>
                <span>
                  {application.property.location.city}, {application.property.location.country}
                </span>
              </div>
            </div>
            <div className="text-xl font-semibold">
              {application.property.pricePerMonth}
              <span className="text-sm font-normal">/ month</span>
            </div>
          </div>
        </div>

        <div className="border-primary-200 hidden h-48 border-[0.5px] lg:block"></div>

        <div className="col just-start w-full gap-5 py-2 lg:h-48 lg:basis-3/12">
          <div>
            <div className="text-lg font-semibold">
              {userType === 'manager' ? 'Tenant' : 'Manager'}
            </div>
            <hr className="mt-3" />
          </div>
          <div className="flex-gap-4">
            <div>
              <Image
                className="mr-2 min-h-10 min-w-10 rounded-full"
                src="/landing-i1.png"
                alt={contactPerson.name}
                width={40}
                height={40}
              ></Image>
            </div>
            <div className="col gap-2">
              <div className="font-semibold">{contactPerson.name}</div>
              <div className="align-center text-primary-600 text-sm">
                <PhoneCall className="mr-2 size-5"></PhoneCall>
                {contactPerson.phoneNumber}
              </div>
              <div className="align-center text-primary-600 text-sm">
                <Mail className="mr-2 size-5"></Mail>
                {contactPerson.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />
      {children}
    </div>
  );
}
