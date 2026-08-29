import type { Location, Prisma } from '../../backend/prisma/generated/client';

export type {
  Application,
  Lease,
  Location,
  Manager,
  Payment,
  Prisma,
  Property,
  Tenant,
} from '../../backend/prisma/generated/client';

export type PropertyWithLocation = Prisma.PropertyGetPayload<{
  include: {
    location: true;
  };
}>;

export type LocationWithCoordinates = Omit<Location, 'coordinates'> & {
  coordinates: {
    longitude: number;
    latitude: number;
  };
};

export type PropertyWithLocationCoordinates = Omit<PropertyWithLocation, 'location'> & {
  location: LocationWithCoordinates;
};

export type PropertyWithRelations = Prisma.PropertyGetPayload<{
  include: {
    location: true;
    manager: true;
    leases: true;
    applications: true;
    favoritedBy: true;
    tenants: true;
  };
}>;
