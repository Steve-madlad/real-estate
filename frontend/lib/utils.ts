import { UserRole } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUserRole = (value: unknown): value is UserRole =>
  value === 'manager' || value === 'tenant';
