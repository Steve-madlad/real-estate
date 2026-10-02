import { APIResonse } from '@/types';
import { ApplicationWithRelations } from '@/types/prismaTypes';

export type ApplicationsResponse = APIResonse<ApplicationWithRelations[]>;
export type SingleApplicationResponse = APIResonse<ApplicationWithRelations>;

export type ApplicationStatus = 'Approved' | 'Denied';
export type ProcessApplicationBody = { status: ApplicationStatus };
export type ProcessApplicationVariables = { id: number; body: ProcessApplicationBody };

export interface CreateApplicationBody {
  propertyId: number;
  name: string;
  email: string;
  phoneNumber: string;
  message?: string;
}
