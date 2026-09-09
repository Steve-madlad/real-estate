import type { AuthUser } from 'aws-amplify/auth';
import { MotionProps as OriginalMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Application, Manager, Property, Tenant } from './prismaTypes';

declare module 'framer-motion' {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
  }
}

declare global {
  interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
  }

  interface PropertyOverviewProps {
    propertyId: number;
  }

  interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
  }

  interface ContactWidgetProps {
    onOpenModal: () => void;
  }

  interface ImagePreviewsProps {
    images: string[];
  }

  interface PropertyDetailsProps {
    propertyId: number;
  }

  interface PropertyOverviewProps {
    propertyId: number;
  }

  interface PropertyLocationProps {
    propertyId: number;
  }

  interface ApplicationCardProps {
    application: Application;
    userType: 'manager' | 'renter';
    children: React.ReactNode;
  }

  interface CardProps {
    property: Property;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface CardCompactProps {
    property: Property;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface HeaderProps {
    title: string;
    subtitle: string;
  }

  interface NavbarProps {
    isDashboard: boolean;
  }

  interface AppSidebarProps {
    userType: UserRole;
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: UserRole;
  }

  type User<TUserInfo = Tenant> =
    | {
        userRole: 'tenant';
        cognitoInfo: AuthUser;
        userInfo: TUserInfo;
      }
    | {
        userRole: 'manager';
        cognitoInfo: AuthUser;
        userInfo: Manager;
      };
}

export type UserRole = 'manager' | 'tenant';

export interface APIResonse<TResponse = unknown> {
  message: string;
  success: boolean;
  data?: TResponse;
}
