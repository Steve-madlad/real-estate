import {
  Wifi,
  Waves,
  Dumbbell,
  Car,
  PawPrint,
  Tv,
  Thermometer,
  Cigarette,
  Cable,
  Maximize,
  Bath,
  Phone,
  Sprout,
  Hammer,
  Bus,
  Mountain,
  VolumeX,
  Home,
  Warehouse,
  Building,
  Castle,
  Trees,
  LucideIcon,
  House,
} from 'lucide-react';
import { IconType } from 'react-icons/lib';
import { MdOutlineHouse } from 'react-icons/md';

// export enum AmenityEnum {
//   WasherDryer = 'WasherDryer',
//   AirConditioning = 'AirConditioning',
//   Dishwasher = 'Dishwasher',
//   HighSpeedInternet = 'HighSpeedInternet',
//   HardwoodFloors = 'HardwoodFloors',
//   WalkInClosets = 'WalkInClosets',
//   Microwave = 'Microwave',
//   Refrigerator = 'Refrigerator',
//   Pool = 'Pool',
//   Gym = 'Gym',
//   Parking = 'Parking',
//   PetsAllowed = 'PetsAllowed',
//   WiFi = 'WiFi',
// }

export const AmenityIcons: Record<AmenityEnum, LucideIcon> = {
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Dishwasher: Waves,
  HighSpeedInternet: Wifi,
  HardwoodFloors: Home,
  WalkInClosets: Maximize,
  Microwave: Tv,
  Refrigerator: Thermometer,
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  PetsAllowed: PawPrint,
  WiFi: Wifi,
};

// export enum HighlightEnum {
//   HighSpeedInternetAccess = 'HighSpeedInternetAccess',
//   WasherDryer = 'WasherDryer',
//   AirConditioning = 'AirConditioning',
//   Heating = 'Heating',
//   SmokeFree = 'SmokeFree',
//   CableReady = 'CableReady',
//   SatelliteTV = 'SatelliteTV',
//   DoubleVanities = 'DoubleVanities',
//   TubShower = 'TubShower',
//   Intercom = 'Intercom',
//   SprinklerSystem = 'SprinklerSystem',
//   RecentlyRenovated = 'RecentlyRenovated',
//   CloseToTransit = 'CloseToTransit',
//   GreatView = 'GreatView',
//   QuietNeighborhood = 'QuietNeighborhood',
// }

export const HighlightIcons: Record<HighlightEnum, LucideIcon> = {
  HighSpeedInternetAccess: Wifi,
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Heating: Thermometer,
  SmokeFree: Cigarette,
  CableReady: Cable,
  SatelliteTV: Tv,
  DoubleVanities: Maximize,
  TubShower: Bath,
  Intercom: Phone,
  SprinklerSystem: Sprout,
  RecentlyRenovated: Hammer,
  CloseToTransit: Bus,
  GreatView: Mountain,
  QuietNeighborhood: VolumeX,
};

// export enum PropertyTypeEnum {
//   Rooms = 'Rooms',
//   Tinyhouse = 'Tinyhouse',
//   Apartment = 'Apartment',
//   Villa = 'Villa',
//   Townhouse = 'Townhouse',
//   Cottage = 'Cottage',
// }

export const PropertyTypeIcons: Record<PropertyTypeEnum, LucideIcon | IconType> = {
  Rooms: House,
  Tinyhouse: MdOutlineHouse,
  Apartment: Building,
  Villa: House,
  Townhouse: House,
  Cottage: Trees,
};

// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 50; // in pixels

// Test users for development
export const testUsers = {
  tenant: {
    username: 'Carol White',
    userId: 'us-east-2:76543210-90ab-cdef-1234-567890abcdef',
    signInDetails: {
      loginId: 'carol.white@example.com',
      authFlowType: 'USER_SRP_AUTH',
    },
  },
  tenantRole: 'tenant',
  manager: {
    username: 'John Smith',
    userId: 'us-east-2:12345678-90ab-cdef-1234-567890abcdef',
    signInDetails: {
      loginId: 'john.smith@example.com',
      authFlowType: 'USER_SRP_AUTH',
    },
  },
  managerRole: 'manager',
};

export enum AmenityEnum {
  'Washer Dryer' = 'WasherDryer',
  'Air Conditioning' = 'AirConditioning',
  Dishwasher = 'Dishwasher',
  'High Speed Internet' = 'HighSpeedInternet',
  'Hardwood Floors' = 'HardwoodFloors',
  'WalkIn Closets' = 'WalkInClosets',
  Microwave = 'Microwave',
  Refrigerator = 'Refrigerator',
  Pool = 'Pool',
  Gym = 'Gym',
  Parking = 'Parking',
  'Pets Allowed' = 'PetsAllowed',
  WiFi = 'WiFi',
}

export enum HighlightEnum {
  'High Speed Internet Access' = 'HighSpeedInternetAccess',
  'Washer Dryer' = 'WasherDryer',
  'Air Conditioning' = 'AirConditioning',
  Heating = 'Heating',
  'Smoke-Free' = 'SmokeFree',
  'Cable Ready' = 'CableReady',
  'Satellite TV' = 'SatelliteTV',
  'Double Vanities' = 'DoubleVanities',
  'Tub Shower' = 'TubShower',
  Intercom = 'Intercom',
  'Sprinkler System' = 'SprinklerSystem',
  'Recently Renovated' = 'RecentlyRenovated',
  'Close To Transit' = 'CloseToTransit',
  GreatView = 'GreatView',
  'Quiet Neighborhood' = 'QuietNeighborhood',
}

export enum PropertyTypeEnum {
  Rooms = 'Rooms',
  'Tiny House' = 'Tinyhouse',
  Apartment = 'Apartment',
  Villa = 'Villa',
  'Town House' = 'Townhouse',
  Cottage = 'Cottage',
}
