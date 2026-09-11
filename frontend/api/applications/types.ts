import { APIResonse } from '@/types';
import { Application } from '@/types/prismaTypes';

export type ApplicationsResponse = APIResonse<Application[]>;
export type SingleApplicationResponse = APIResonse<Application>;

export type ApplicationStatus = 'Approved' | 'Denied';
export type ProcessApplicationBody = { status: ApplicationStatus };
export type ProcessApplicationVariables = { id: string; body: ProcessApplicationBody };
