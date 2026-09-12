import { APIResonse } from '@/types';
import { ApplicationWithRelations } from '@/types/prismaTypes';

export type ApplicationsResponse = APIResonse<ApplicationWithRelations[]>;
export type SingleApplicationResponse = APIResonse<ApplicationWithRelations>;

export type ApplicationStatus = 'Approved' | 'Denied';
export type ProcessApplicationBody = { status: ApplicationStatus };
export type ProcessApplicationVariables = { id: string; body: ProcessApplicationBody };
