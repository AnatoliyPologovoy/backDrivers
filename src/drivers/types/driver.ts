import { VENICLE_FEATURE } from '../../core/constants';

export type VehicleFeature =
  (typeof VENICLE_FEATURE)[keyof typeof VENICLE_FEATURE];

// Данные храним в массиве в памяти, поэтому id — обычное число (позже, с БД, станет строкой).
export type Driver = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  vehicleMake: string; // e.g., Toyota
  vehicleModel: string; // e.g., Camry
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
  createdAt: Date;
};
