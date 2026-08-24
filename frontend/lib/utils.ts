import { FilterState } from '@/store/filter-store';
import { UserRole } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUserRole = (value: unknown): value is UserRole =>
  value === 'manager' || value === 'tenant';

export const k = (value: number) => {
  return `${value / 1000}k`;
};

export function cleanParams(params: FilterState): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== 'any' &&
        value !== '' &&
        (Array.isArray(value) ? value.some((v) => v! == null) : value !== null),
    ),
  );
}
